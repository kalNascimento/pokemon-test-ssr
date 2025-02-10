export interface PageableRequest<T> {
  count: number;
  next: string;
  previous: string;
  results: T[]
}