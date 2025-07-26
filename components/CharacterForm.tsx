
import React from 'react';
import { Inclination } from '../types';
import Spinner from './Spinner';
import { useI18n } from '../context/i18n';

interface CharacterFormProps {
    name: string;
    setName: (name: string) => void;
    race: string;
    setRace: (race: string) => void;
    inclination: Inclination;
    setInclination: (inclination: Inclination) => void;
    setting: string;
    setSetting: (setting: string) => void;
    inclinations: {key: Inclination, value: string}[];
    onGenerate: () => void;
    isLoading: boolean;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
    name, setName, race, setRace, inclination, setInclination, setting, setSetting, inclinations, onGenerate, isLoading
}) => {
    const { t } = useI18n();

    const InputLabel: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
        <label htmlFor={htmlFor} className="block mb-2 text-sm font-medium text-gray-300">{children}</label>
    );

    const baseInputStyles = "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5";

    return (
        <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-6">{t('formTitle')}</h2>
            <div>
                <InputLabel htmlFor="name">{t('labelName')}</InputLabel>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={baseInputStyles} placeholder={t('placeholderName')} required />
            </div>
            <div>
                <InputLabel htmlFor="race">{t('labelRace')}</InputLabel>
                <input type="text" id="race" value={race} onChange={(e) => setRace(e.target.value)} className={baseInputStyles} placeholder={t('placeholderRace')} required />
            </div>
            <div>
                <InputLabel htmlFor="inclination">{t('labelInclination')}</InputLabel>
                <select id="inclination" value={inclination} onChange={(e) => setInclination(e.target.value as Inclination)} className={baseInputStyles}>
                    {inclinations.map(inc => <option key={inc.key} value={inc.key}>{inc.value}</option>)}
                </select>
            </div>
            <div>
                <InputLabel htmlFor="setting">{t('labelSetting')}</InputLabel>
                <input type="text" id="setting" value={setting} onChange={(e) => setSetting(e.target.value)} className={baseInputStyles} placeholder={t('placeholderSetting')} required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center">
                {isLoading ? <><Spinner /> <span className="ml-2">{t('buttonGenerating')}</span></> : t('buttonGenerate')}
            </button>
        </form>
    );
};

export default CharacterForm;
