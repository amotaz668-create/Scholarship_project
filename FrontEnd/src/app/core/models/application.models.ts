import { Scholarship } from './scholarship.models';

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
  fileUrl: string;
}

export interface ApplicationAnswer {
  question: string;
  answer: string;
}

export interface ScholarshipApplication {
  _id: string;
  studentId: string;
  scholarshipId: string | Scholarship;
  scholarshipTitle: string;
  assignedEmployeeId?: string | null;
  documents: ApplicationDocument[];
  answers: ApplicationAnswer[];
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
