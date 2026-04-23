export interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: string;
  accent: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type SortDirection = 'asc' | 'desc';

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
