export interface DashboardStatistics {
  totalUsers: number;
  totalStudents: number;
  totalScholarships: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

export interface AggregateCount {
  _id: string;
  count: number;
}

export interface EmployeeApplicationCount {
  employeeId: string;
  employeeName?: string;
  employeeEmail?: string;
  count: number;
}

export interface AdminStatistics {
  applicationsByStatus: AggregateCount[];
  scholarshipsByDegree: AggregateCount[];
  applicationsPerEmployee: EmployeeApplicationCount[];
}

export interface AdminLog {
  _id: string;
  adminId: { _id: string; email: string; role: string } | string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details: string;
  createdAt: string;
}
