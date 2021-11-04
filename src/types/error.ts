export class CustomError extends Error {
  errorType: CustomErrorType
  errorData: any

  constructor(errorType: CustomErrorType, errorData?: any, message?: string) {
    super(message || '')

    this.errorType = errorType
    this.errorData = errorData
  }
}

export enum CustomErrorType {
  SERVICE_NOT_AVAILABLE,
  SERVICE_ERROR,
  ERROR_RESPONSE,
  PARSE_QUOTE_FAIL,
  ZERO_PREMIUM,
  PAYMENT_ERROR,
  SESSION_EXPIRED
}
