import { Gender } from './constants';

export type UserRole = 'student' | 'employee' | 'admin';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  data: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface StudentProfile {
  _id?: string;
  userId?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  country?: string;
  address?: string;
  university?: string;
  faculty?: string;
  department?: string;
  degree?: 'Bachelor' | 'Master' | 'PhD';
  graduationYear?: number;
  GPA?: number;
  targetDegreeLevel?: 'Bachelor' | 'Master' | 'PhD';
  preferredMajors?: string[];
  preferredCountries?: string[];
  englishLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  IELTS?: number;
  TOEFL?: number;
  skills?: string[];
  languages?: string[];
  interests?: string[];
  bio?: string;
  favorites?: string[];
}

export interface StudentProfileResponse {
  profile: StudentProfile;
  completionPercentage: number;
}
