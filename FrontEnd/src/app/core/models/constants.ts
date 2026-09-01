export const SCHOLARSHIP_STATUSES = ['draft', 'published', 'closed'] as const;
export type ScholarshipStatus = typeof SCHOLARSHIP_STATUSES[number];
export const GENDER_VALUES = ['Male', 'Female'] as const;
export type Gender = typeof GENDER_VALUES[number];
export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
