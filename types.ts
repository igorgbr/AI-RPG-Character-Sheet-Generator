
export enum Inclination {
    LAWFUL_GOOD = 'LAWFUL_GOOD',
    NEUTRAL_GOOD = 'NEUTRAL_GOOD',
    CHAOTIC_GOOD = 'CHAOTIC_GOOD',
    LAWFUL_NEUTRAL = 'LAWFUL_NEUTRAL',
    TRUE_NEUTRAL = 'TRUE_NEUTRAL',
    CHAOTIC_NEUTRAL = 'CHAOTIC_NEUTRAL',
    LAWFUL_EVIL = 'LAWFUL_EVIL',
    NEUTRAL_EVIL = 'NEUTRAL_EVIL',
    CHAOTIC_EVIL = 'CHAOTIC_EVIL',
}

export interface CharacterStats {
    mainSkills: Record<string, number>;
    secondarySkills: Record<string, number>;
    extraSkills: Record<string, number>;
}

export interface Equipment {
    weapon: { name: string; damage: number };
    shield: { name: string; defense: number };
}

export interface CharacterData {
    name: string;
    race: string;
    inclination: string;
    setting: string;
    stats: CharacterStats;
    equipment: Equipment;
    description: string;
    imageUrl: string;
    settingImageUrl: string;
}
