export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface ReferenceItem {
  _id: string;
  name: string;
  code?: string;
  city?: string;
}

export interface ApiFailure {
  success?: false;
  message?: string;
  error?: string;
  errors?: Array<{ msg?: string; message?: string }>;
}
