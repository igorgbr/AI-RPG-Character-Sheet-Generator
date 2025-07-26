
import { Inclination } from './types';

type Translator = (key: string) => string;

export const getInclinations = (t: Translator): {key: Inclination, value: string}[] => [
    { key: Inclination.LAWFUL_GOOD, value: t('inclination.lawful_good') },
    { key: Inclination.NEUTRAL_GOOD, value: t('inclination.neutral_good') },
    { key: Inclination.CHAOTIC_GOOD, value: t('inclination.chaotic_good') },
    { key: Inclination.LAWFUL_NEUTRAL, value: t('inclination.lawful_neutral') },
    { key: Inclination.TRUE_NEUTRAL, value: t('inclination.true_neutral') },
    { key: Inclination.CHAOTIC_NEUTRAL, value: t('inclination.chaotic_neutral') },
    { key: Inclination.LAWFUL_EVIL, value: t('inclination.lawful_evil') },
    { key: Inclination.NEUTRAL_EVIL, value: t('inclination.neutral_evil') },
    { key: Inclination.CHAOTIC_EVIL, value: t('inclination.chaotic_evil') },
];

export const getMainSkills = (t: Translator): string[] => [
    t('mainSkills.strength'),
    t('mainSkills.dexterity'),
    t('mainSkills.agility'),
    t('mainSkills.intelligence')
];

export const getSecondarySkills = (t: Translator): string[] => [
    t('secondarySkills.subterfuge'),
    t('secondarySkills.luck'),
    t('secondarySkills.toolExpertise'),
    t('secondarySkills.appearance'),
    t('secondarySkills.emotionalControl')
];
