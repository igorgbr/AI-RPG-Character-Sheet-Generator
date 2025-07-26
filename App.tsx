
import React, { useState, useCallback, useRef } from 'react';
import { CharacterData, Inclination } from './types';
import { getInclinations, getMainSkills, getSecondarySkills } from './constants';
import { generateCharacterDetails, generateCharacterImage, generateSettingImage } from './services/geminiService';
import { distributePoints } from './utils/distribution';
import CharacterForm from './components/CharacterForm';
import CharacterSheet from './components/CharacterSheet';
import Spinner from './components/Spinner';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useI18n } from './context/i18n';

type Theme = 'default' | 'horror' | 'fantasy';

const App: React.FC = () => {
    const { t, locale } = useI18n();
    const [name, setName] = useState<string>('');
    const [race, setRace] = useState<string>(t('defaultRace'));
    const [inclination, setInclination] = useState<Inclination>(Inclination.TRUE_NEUTRAL);
    const [setting, setSetting] = useState<string>(t('defaultSetting'));
    
    const [characterData, setCharacterData] = useState<CharacterData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('default');

    const sheetRef = useRef<HTMLDivElement>(null);

    const handleGenerate = useCallback(async () => {
        if (!name) {
            setError(t('errorNameRequired'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setCharacterData(null);
        setTheme('default');

        try {
            const mainSkills = getMainSkills(t);
            const secondarySkills = getSecondarySkills(t);
            
            const mainSkillPoints = distributePoints(10, mainSkills.length);
            const secondarySkillPoints = distributePoints(10, secondarySkills.length);
            
            const baseStats = {
                mainSkills: Object.fromEntries(mainSkills.map((skill, i) => [skill, mainSkillPoints[i]])),
                secondarySkills: Object.fromEntries(secondarySkills.map((skill, i) => [skill, secondarySkillPoints[i]])),
            };

            const detailsResult = await generateCharacterDetails({ setting }, t);
             if ('description' in detailsResult) {
                throw new Error(t('errorApiUnexpectedDescription'));
            }
            const { extraSkillNames, weaponName, shieldName } = detailsResult;
            
            const extraSkillPoints = distributePoints(5, extraSkillNames.length);
            
            const fullStats = {
                ...baseStats,
                extraSkills: Object.fromEntries(extraSkillNames.map((skill, i) => [skill, extraSkillPoints[i]])),
            };

            const equipment = {
                weapon: { name: weaponName, damage: Math.floor(Math.random() * 9) + 1 },
                shield: { name: shieldName, defense: Math.floor(Math.random() * 5) + 1 },
            };
            
            const inclinationValue = getInclinations(t).find(i => i.key === inclination)?.value ?? inclination;
            const partialCharacter = { name, race, inclination: inclinationValue, setting, stats: fullStats, equipment };

            const [descriptionResult, imageUrl, settingImageUrl] = await Promise.all([
                generateCharacterDetails({ ...partialCharacter, mainSkillsList: mainSkills, secondarySkillsList: secondarySkills, isGeneratingDescription: true }, t),
                generateCharacterImage({ name, race, setting, inclination: inclinationValue }, t),
                generateSettingImage(setting, t)
            ]);

            if ('extraSkillNames' in descriptionResult) {
                 throw new Error(t('errorApiUnexpectedSkills'));
            }

            const finalCharacter: CharacterData = {
                ...partialCharacter,
                description: descriptionResult.description,
                imageUrl,
                settingImageUrl,
            };

            const lowerCaseSetting = finalCharacter.setting.toLowerCase();
            if (['terror', 'vampiro', 'assombrado'].some(word => lowerCaseSetting.includes(word))) {
                setTheme('horror');
            } else if (lowerCaseSetting.includes(t('filterFantasy').toLowerCase())) {
                setTheme('fantasy');
            }

            setCharacterData(finalCharacter);

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    }, [name, race, inclination, setting, t, locale]);

    const nameColor = theme === 'horror' ? 'text-red-500' : theme === 'fantasy' ? 'text-amber-800' : 'text-purple-400';
    const containerClassName = theme === 'horror' ? 'bg-black' : 'bg-gray-900';
    const containerStyle = theme === 'fantasy' ? { filter: 'sepia(70%)' } : {};

    return (
        <div 
            className={`min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8 transition-all duration-500 ${containerClassName}`}
            style={containerStyle}
        >
            <div className="container mx-auto">
                <header className="text-center mb-8 relative">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        {t('appTitle')}
                    </h1>
                    <p className="text-gray-400 mt-2">{t('appSubtitle')}</p>
                    <div className="absolute top-0 right-0">
                       <LanguageSwitcher />
                    </div>
                </header>
                
                <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                        <CharacterForm
                            name={name} setName={setName}
                            race={race} setRace={setRace}
                            inclination={inclination} setInclination={setInclination}
                            setting={setting} setSetting={setSetting}
                            inclinations={getInclinations(t)}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                        />
                    </div>
                    
                    <div className="lg:col-span-3">
                        {isLoading && (
                            <div className="flex flex-col justify-center items-center h-full bg-gray-800/50 rounded-xl p-8">
                                <Spinner />
                                <p className="mt-4 text-lg text-gray-300 animate-pulse">{t('loadingMessage')}</p>
                            </div>
                        )}
                        {error && (
                            <div className="flex flex-col justify-center items-center h-full bg-red-900/20 border border-red-500 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-red-400">{t('errorTitle')}</h3>
                                <p className="text-red-300 mt-2 text-center">{error}</p>
                            </div>
                        )}
                        {!isLoading && !characterData && !error && (
                             <div className="flex flex-col justify-center items-center h-full bg-gray-800/50 rounded-xl p-8 border-2 border-dashed border-gray-600">
                                <h3 className="text-xl font-bold text-gray-300">{t('initialStateTitle')}</h3>
                                <p className="text-gray-400 mt-2 text-center">{t('initialStateSubtitle')}</p>
                            </div>
                        )}
                        {characterData && (
                            <CharacterSheet ref={sheetRef} data={characterData} nameColor={nameColor} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
