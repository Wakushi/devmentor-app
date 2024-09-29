export enum StudentSignUpSteps {
  LEARNING = "LEARNING",
  LANGUAGE = "LANGUAGE",
  CONTACT = "CONTACT",
}

export enum MentorSignUpSteps {
  IDENTITY = "IDENTITY",
  LANGUAGE = "LANGUAGE",
  CREDENTIALS = "CREDENTIALS",
}

export enum Experience {
  NOVICE = "NOVICE",
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADEPT = "ADEPT",
}

export enum ContactType {
  DISCORD = "DISCORD",
  EMAIL = "EMAIL",
  TWITTER = "TWITTER",
  LINKEDIN = "LINKEDIN",
  GITHUB = "GITHUB",
  TELEGRAM = "TELEGRAM",
}

export interface ExperienceInfo {
  label: string
  description: string
}

export const experienceDescriptions: Record<Experience, ExperienceInfo> = {
  [Experience.NOVICE]: {
    label: "Novice",
    description:
      "You're just starting out in the field. You have basic knowledge but limited practical experience. You're eager to learn and explore the fundamentals.",
  },
  [Experience.BEGINNER]: {
    label: "Beginner",
    description:
      "You have some foundational knowledge and maybe a few small projects under your belt. You're familiar with key concepts but still learning how to apply them effectively.",
  },
  [Experience.INTERMEDIATE]: {
    label: "Intermediate",
    description:
      "You have a solid understanding of the field and some practical experience. You can work on projects independently but might need guidance on more complex issues.",
  },
  [Experience.ADEPT]: {
    label: "Adept",
    description:
      "You have extensive knowledge and significant practical experience. You're comfortable with complex projects and can often guide others. You're continuously deepening your expertise.",
  },
}

export enum LearningField {
  BLOCKCHAIN = "BLOCKCHAIN",
  SMART_CONTRACTS = "SMART_CONTRACTS",
  DEFI = "DEFI",
  NFT = "NFT",
  WEB3_DEVELOPMENT = "WEB3_DEVELOPMENT",
  CRYPTOCURRENCY = "CRYPTOCURRENCY",
  TOKENOMICS = "TOKENOMICS",
  DAO = "DAO",
}

export const learningFieldOptions = [
  { value: LearningField.BLOCKCHAIN, label: "Blockchain" },
  { value: LearningField.SMART_CONTRACTS, label: "Smart Contracts" },
  { value: LearningField.DEFI, label: "DeFi" },
  { value: LearningField.NFT, label: "NFTs" },
  { value: LearningField.WEB3_DEVELOPMENT, label: "Web3 Development" },
  { value: LearningField.CRYPTOCURRENCY, label: "Cryptocurrency" },
  { value: LearningField.TOKENOMICS, label: "Tokenomics" },
  { value: LearningField.DAO, label: "DAOs" },
]

export enum Language {
  ENGLISH = "en",
  FRENCH = "fr",
  GERMAN = "de",
  SPANISH = "es",
  ITALIAN = "it",
  DUTCH = "nl",
  PORTUGUESE = "pt",
  RUSSIAN = "ru",
  CHINESE = "zh",
  JAPANESE = "ja",
}

export interface LanguageOption {
  value: Language
  label: string
  code: string
}

export const languageOptions: LanguageOption[] = [
  { value: Language.ENGLISH, label: "English", code: "GB" },
  { value: Language.FRENCH, label: "French", code: "FR" },
  { value: Language.GERMAN, label: "German", code: "DE" },
  { value: Language.SPANISH, label: "Spanish", code: "ES" },
  { value: Language.ITALIAN, label: "Italian", code: "IT" },
  { value: Language.DUTCH, label: "Dutch", code: "NL" },
  { value: Language.PORTUGUESE, label: "Portuguese", code: "PT" },
  { value: Language.RUSSIAN, label: "Russian", code: "RU" },
  { value: Language.CHINESE, label: "Chinese", code: "CN" },
  { value: Language.JAPANESE, label: "Japanese", code: "JP" },
]

export function getLanguageOption(code: string): LanguageOption | null {
  const lang = languageOptions.find(
    (l) => l.value.toLowerCase() === code.toLowerCase()
  )
  return lang || null
}
