type GenderConfig = {
  is_male: boolean;
  is_female: boolean;
  is_neuter: boolean;
  is_plural: boolean;
  is_mixed: boolean;
  is_guess: boolean;
  is_unknown: boolean;
  subject: string;
  possessive: string;
  reflexive: string;
  object: string;
  string: string;
};

export enum GenderConstEnum {
  NOT_A_PERSON = 0,
  FEMALE_SINGULAR = 1,
  MALE_SINGULAR = 2,
  FEMALE_SINGULAR_GUESS = 3,
  MALE_SINGULAR_GUESS = 4,
  // 5 seems to indicate a group of people who may be of mixed gender
  MIXED_UNKNOWN = 5,
  NEUTER_SINGULAR = 6,
  UNKNOWN_SINGULAR = 7,
  FEMALE_PLURAL = 8,
  MALE_PLURAL = 9,
  NEUTER_PLURAL = 10,
  UNKNOWN_PLURAL = 11,
}

export const Genders = [
  GenderConstEnum.NOT_A_PERSON,
  GenderConstEnum.FEMALE_SINGULAR,
  GenderConstEnum.MALE_SINGULAR,
  GenderConstEnum.FEMALE_SINGULAR_GUESS,
  GenderConstEnum.MALE_SINGULAR_GUESS,
  GenderConstEnum.MIXED_UNKNOWN,
  GenderConstEnum.NEUTER_SINGULAR,
  GenderConstEnum.UNKNOWN_SINGULAR,
  GenderConstEnum.FEMALE_PLURAL,
  GenderConstEnum.MALE_PLURAL,
  GenderConstEnum.NEUTER_PLURAL,
  GenderConstEnum.UNKNOWN_PLURAL,
] as const;

const NotAPerson = {
  is_male: false,
  is_female: false,
  is_neuter: false,
  is_plural: false,
  is_mixed: false,
  is_guess: false,
  is_unknown: true,
  subject: 'they',
  possessive: 'their',
  reflexive: 'themself',
  object: 'this',
  string: 'unknown',
};

const data: Partial<Record<GenderConstEnum, GenderConfig>> = {
  [GenderConstEnum.NOT_A_PERSON]: NotAPerson,
  [GenderConstEnum.UNKNOWN_SINGULAR]: {
    is_male: false,
    is_female: false,
    is_neuter: false,
    is_plural: false,
    is_mixed: false,
    is_guess: false,
    is_unknown: true,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themself',
    object: 'them',
    string: 'unknown singular',
  },
  [GenderConstEnum.FEMALE_SINGULAR]: {
    is_male: false,
    is_female: true,
    is_neuter: false,
    is_plural: false,
    is_mixed: false,
    is_guess: false,
    is_unknown: false,
    subject: 'she',
    possessive: 'her',
    reflexive: 'herself',
    object: 'her',
    string: 'female singular',
  },
  [GenderConstEnum.FEMALE_SINGULAR_GUESS]: {
    is_male: false,
    is_female: true,
    is_neuter: false,
    is_plural: false,
    is_mixed: false,
    is_guess: true,
    is_unknown: false,
    subject: 'she',
    possessive: 'her',
    reflexive: 'herself',
    object: 'her',
    string: 'female singular',
  },
  [GenderConstEnum.MALE_SINGULAR]: {
    is_male: true,
    is_female: false,
    is_neuter: false,
    is_plural: false,
    is_mixed: false,
    is_guess: false,
    is_unknown: false,
    subject: 'he',
    possessive: 'his',
    reflexive: 'himself',
    object: 'him',
    string: 'male singular',
  },
  [GenderConstEnum.MALE_SINGULAR_GUESS]: {
    is_male: true,
    is_female: false,
    is_neuter: false,
    is_plural: false,
    is_mixed: false,
    is_guess: true,
    is_unknown: false,
    subject: 'he',
    possessive: 'his',
    reflexive: 'himself',
    object: 'him',
    string: 'male singular',
  },
  [GenderConstEnum.NEUTER_SINGULAR]: {
    is_male: false,
    is_female: false,
    is_neuter: true,
    is_plural: false,
    is_mixed: false,
    is_guess: false,
    is_unknown: false,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themself',
    object: 'them',
    string: 'neuter singular',
  },
  [GenderConstEnum.MIXED_UNKNOWN]: {
    is_male: false,
    is_female: false,
    is_neuter: false,
    is_plural: true,
    is_mixed: true,
    is_guess: false,
    is_unknown: false,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themselves',
    object: 'them',
    string: 'mixed plural',
  },
  [GenderConstEnum.FEMALE_PLURAL]: {
    is_male: false,
    is_female: true,
    is_neuter: false,
    is_plural: true,
    is_mixed: false,
    is_guess: false,
    is_unknown: false,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themselves',
    object: 'them',
    string: 'female plural',
  },
  [GenderConstEnum.MALE_PLURAL]: {
    is_male: true,
    is_female: false,
    is_neuter: false,
    is_plural: true,
    is_mixed: false,
    is_guess: false,
    is_unknown: false,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themselves',
    object: 'them',
    string: 'male plural',
  },
  [GenderConstEnum.NEUTER_PLURAL]: {
    is_male: false,
    is_female: false,
    is_neuter: true,
    is_plural: true,
    is_mixed: false,
    is_guess: false,
    is_unknown: false,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themselves',
    object: 'them',
    string: 'neuter plural',
  },
  [GenderConstEnum.UNKNOWN_PLURAL]: {
    is_male: false,
    is_female: false,
    is_neuter: false,
    is_plural: true,
    is_mixed: false,
    is_guess: false,
    is_unknown: true,
    subject: 'they',
    possessive: 'their',
    reflexive: 'themselves',
    object: 'them',
    string: 'unknown plural',
  },
} as const;

export function getData(
  gender: GenderConstEnum,
  usage: keyof GenderConfig
): boolean | string {
  return (data[gender] || NotAPerson)[usage];
}
