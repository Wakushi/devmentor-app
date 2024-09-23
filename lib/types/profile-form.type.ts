export enum ProfileSteps {
  LEARNING = "LEARNING",
  LANGUAGE = "LANGUAGE",
  CONTACT = "CONTACT",
}

export enum Experience {
  NOVICE = "NOVICE",
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADEPT = "ADEPT",
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

export const learningFieldOptions = [
  { value: "blockchain", label: "Blockchain" },
  { value: "smart_contracts", label: "Smart Contracts" },
  { value: "defi", label: "DeFi" },
  { value: "nft", label: "NFTs" },
  { value: "web3_development", label: "Web3 Development" },
  { value: "cryptocurrency", label: "Cryptocurrency" },
  { value: "tokenomics", label: "Tokenomics" },
  { value: "dao", label: "DAOs" },
]

export const languageOptions = [
  { value: "en", label: "English", code: "GB" },
  { value: "fr", label: "French", code: "FR" },
  { value: "de", label: "German", code: "DE" },
  { value: "es", label: "Spanish", code: "ES" },
  { value: "it", label: "Italian", code: "IT" },
  { value: "nl", label: "Dutch", code: "NL" },
  { value: "pt", label: "Portuguese", code: "PT" },
  { value: "ru", label: "Russian", code: "RU" },
  { value: "zh", label: "Chinese", code: "CN" },
  { value: "ja", label: "Japanese", code: "JP" },
]
