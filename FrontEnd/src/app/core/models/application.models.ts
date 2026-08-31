import { Scholarship } from './scholarship.models';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'missing_documents'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

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
