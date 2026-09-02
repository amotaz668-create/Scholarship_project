import { Scholarship } from './scholarship.models';
import { ApplicationRequirement } from './scholarship.models';
import { StudentDocument } from './notification.models';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'missing_documents'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  'draft',
  'submitted',
  'under_review',
  'missing_documents',
  'accepted',
  'rejected',
  'withdrawn'
];

// Staff targets are restricted by validateUpdateStatus on the backend. These
// transitions are the intersection of that validator and the service workflow.
export const STAFF_APPLICATION_TRANSITIONS: Readonly<Record<ApplicationStatus, readonly ApplicationStatus[]>> = {
  draft: [],
  submitted: ['under_review'],
  under_review: ['accepted', 'rejected', 'missing_documents'],
  missing_documents: ['under_review', 'rejected'],
  accepted: [],
  rejected: [],
  withdrawn: []
};

export function applicationStatusText(status: ApplicationStatus | string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface ApplicationTimelineItem {
  oldStatus?: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy?: string;
  note?: string;
  date: string;
}

export interface ApplicationDocument {
  documentId?: string;
  name: string;
  type?: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string;
}

export interface ApplicationAnswer {
  requirementKey?: string;
  question: string;
  answer: unknown;
}

export interface MissingRequirement {
  key: string;
  label: string;
  labelAr?: string;
}

export interface ApplicationMissingData {
  profileFields: MissingRequirement[];
  answers: MissingRequirement[];
  documents: string[];
}

export interface ResolvedApplicationRequirement extends ApplicationRequirement {
  value?: unknown;
  origin: 'profile' | 'application' | 'missing';
  missing: boolean;
}

export interface ScholarshipApplication {
  _id: string;
  studentId: string;
  scholarshipId: string | Scholarship;
  scholarshipTitle: string;
  assignedEmployeeId?: string | null;
  documents: ApplicationDocument[];
  answers: ApplicationAnswer[];
  profileData?: Record<string, unknown>;
  profileSnapshot?: Record<string, unknown> | null;
  isComplete?: boolean;
  missing?: ApplicationMissingData;
  status: ApplicationStatus;
  timeline: ApplicationTimelineItem[];
  notes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateApplicationPayload {
  scholarshipId: string;
  documents?: ApplicationDocument[];
  answers?: ApplicationAnswer[];
}

export interface UpdateApplicationPayload {
  answers?: ApplicationAnswer[];
  profileData?: Record<string, unknown>;
  documents?: ApplicationDocument[];
  saveProfile?: boolean;
}

export interface ApplicationPreparation {
  application: ScholarshipApplication;
  scholarship: Scholarship;
  profileData: Record<string, unknown>;
  requirements: ResolvedApplicationRequirement[];
  availableDocuments: StudentDocument[];
  selectedDocumentIds: string[];
  readiness: {
    complete: boolean;
    missing: ApplicationMissingData;
  };
}
