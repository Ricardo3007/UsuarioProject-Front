
export interface ResponseStructure<T> {
  [key: string]: unknown;
  message: string;
  data: T;
  success?: boolean;
  statusCode: number;
}
