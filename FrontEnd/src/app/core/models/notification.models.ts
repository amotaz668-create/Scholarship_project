export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StudentDocument {
  _id: string;
  studentId: string;
  applicationId?: string | null;
  type: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  fileSize?: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'needs_update';
  reviewNote?: string;
  uploadedAt: string;
}
