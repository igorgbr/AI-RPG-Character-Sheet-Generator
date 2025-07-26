
import { GoogleGenAI, Type } from "@google/genai";
import { CharacterData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
type Translator = (key: string, params?: Record<string, string | number>) => string;

type DetailsParams = {
    setting: string;
    isGeneratingDescription?: false;
} | {
    isGeneratingDescription: true;
    mainSkillsList: string[];
    secondarySkillsList: string[];
} & Omit<CharacterData, 'description' | 'imageUrl' | 'settingImageUrl'>;

export const generateCharacterDetails = async (params: DetailsParams, t: Translator): Promise<{ extraSkillNames: string[]; weaponName: string; shieldName: string } | { description: string }> => {
    if (params.isGeneratingDescription) {
        const { name, race, inclination, setting, stats, equipment, mainSkillsList, secondarySkillsList } = params;
        
        const mainSkillsText = mainSkillsList.map(skill => `${skill}: ${stats.mainSkills[skill]}`).join(', ');
        const secondarySkillsText = secondarySkillsList.map(skill => `${skill}: ${stats.secondarySkills[skill]}`).join(', ');

        const prompt = t('descriptionPrompt', {
            name,
            race,
            inclination,
            setting,
            mainSkills: mainSkillsText,
            secondarySkills: secondarySkillsText,
            extraSkills: Object.keys(stats.extraSkills).join(', '),
            weaponName: equipment.weapon.name,
            weaponDamage: equipment.weapon.damage,
            shieldName: equipment.shield.name,
            shieldDefense: equipment.shield.defense,
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return { description: response.text };
    } else {
        const { setting } = params;

        const skillsPromise = ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: t('extraSkillsPrompt', { setting }),
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        const weaponPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: t('weaponNamePrompt', { setting })
        });

        const shieldPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: t('shieldNamePrompt', { setting })
        });

        const [skillsResponse, weaponResponse, shieldResponse] = await Promise.all([skillsPromise, weaponPromise, shieldPromise]);
        
        let extraSkillNames = [];
        try {
            const parsedSkills = JSON.parse(skillsResponse.text);
            if(Array.isArray(parsedSkills) && parsedSkills.every(s => typeof s === 'string')) {
                extraSkillNames = parsedSkills;
            } else {
                throw new Error("Invalid skill format from API");
            }
        } catch (e) {
            console.error("Failed to parse skills, using defaults:", e);
            extraSkillNames = [t('fallback.skill1'), t('fallback.skill2'), t('fallback.skill3')];
        }

        return {
            extraSkillNames,
            weaponName: weaponResponse.text.trim() || t('fallback.weapon'),
            shieldName: shieldResponse.text.trim() || t('fallback.shield'),
        };
    }
};

export const generateCharacterImage = async ({ name, race, setting, inclination }: { name: string, race: string, setting: string, inclination: string }, t: Translator): Promise<string> => {
    const prompt = t('characterImagePrompt', { name, race, setting, inclination: inclination.toLowerCase() });

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '3:4',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error(t('errorImageGeneration'));
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateSettingImage = async (setting: string, t: Translator): Promise<string> => {
    const prompt = t('settingImagePrompt', { setting });
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '9:16', 
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        console.error("Setting image generation failed, returning a fallback.");
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8DtXNJsAAAAASUVORK5CYII=";
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};
