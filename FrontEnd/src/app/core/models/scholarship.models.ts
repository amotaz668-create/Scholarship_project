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
