const SCHOLARSHIP_STATUSES = Object.freeze(["draft", "published", "closed"]);
const GENDER_VALUES = Object.freeze(["Male", "Female"]);
const DEGREE_VALUES = Object.freeze(["Bachelor", "Master", "PhD"]);
const DOCUMENT_TYPES = Object.freeze([
  "CV",
  "Passport",
  "Transcript",
  "GraduationCertificate",
  "RecommendationLetter",
  "MotivationLetter",
  "LanguageCertificate",
  "Other",
]);
const APPLICATION_REQUIREMENT_TYPES = Object.freeze([
  "text",
  "textarea",
  "number",
  "date",
  "select",
  "boolean",
  "document",
]);
const APPLICATION_REQUIREMENT_SOURCES = Object.freeze(["profile", "application"]);
const APPLICATION_PROFILE_FIELDS = Object.freeze([
  "name",
  "email",
  "phone",
  "dateOfBirth",
  "gender",
  "nationality",
  "country",
  "address",
  "university",
  "faculty",
  "department",
  "degree",
  "graduationYear",
  "GPA",
  "targetDegreeLevel",
  "englishLevel",
  "IELTS",
  "TOEFL",
]);

module.exports = {
  SCHOLARSHIP_STATUSES,
  GENDER_VALUES,
  DEGREE_VALUES,
  DOCUMENT_TYPES,
  APPLICATION_REQUIREMENT_TYPES,
  APPLICATION_REQUIREMENT_SOURCES,
  APPLICATION_PROFILE_FIELDS,
};
