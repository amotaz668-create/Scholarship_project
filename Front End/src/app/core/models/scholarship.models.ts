import { ReferenceItem } from './api.models';
import { Gender, ScholarshipStatus } from './constants';

export interface EligibilityRules {
  minGPA?: number;
  maxAge?: number;
  eligibleCountries?: Array<string | ReferenceItem>;
  eligibleFields?: string[];
  eligibleDegrees?: string[];
  gender?: Gender;
}

export interface RequiredDocument {
  type: string;
  required: boolean;
}

export type ApplicationRequirementType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'boolean' | 'document';
export type ApplicationRequirementSource = 'profile' | 'application';

export interface ApplicationRequirement {
  key: string;
  label: string;
  labelAr?: string;
  type: ApplicationRequirementType;
  required: boolean;
  options?: string[];
  source: ApplicationRequirementSource;
  profileField?: string;
}

export interface Scholarship {
  _id: string;
  title: string;
  description: string;
  provider: string;
  category: string | ReferenceItem;
  university: string | ReferenceItem;
  country: string | ReferenceItem;
  fundingType: string;
  amount?: number;
  currency?: string;
  deadline: string;
  applicationUrl?: string;
  eligibility?: EligibilityRules;
  requiredDocuments?: RequiredDocument[];
  applicationRequirements?: ApplicationRequirement[];
  status: ScholarshipStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScholarshipFilters {
  search?: string;
  country?: string;
  category?: string;
  university?: string;
  fundingType?: string;
  minGPA?: number;
  deadline?: string;
  status?: ScholarshipStatus;
  page?: number;
  limit?: number;
}

export interface ScholarshipPayload {
  title: string;
  description: string;
  provider: string;
  category: string;
  university: string;
  country: string;
  fundingType: string;
  amount?: number;
  currency?: string;
  deadline: string;
  applicationUrl?: string;
  eligibility?: EligibilityRules;
  requiredDocuments?: RequiredDocument[];
  applicationRequirements?: ApplicationRequirement[];
  status?: ScholarshipStatus;
}

export interface EligibilityPayload {
  GPA?: number;
  nationality?: string;
  degree?: string;
  field?: string;
  age?: number;
  gender?: Gender;
}
