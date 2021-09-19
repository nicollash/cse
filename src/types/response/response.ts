export type Response<T> = {
  id?: string
  ResponseParams?: Array<ResponseParams>
} & T

export type GenericErrorResponse = {
  StatusCode?: number
  Error?: Array<GenericError>
}

type GenericError = {
  Message?: string
  Type?: string
  Name?: string
  Severity?: string
  StackTrace?: string
}

type ResponseParams = {
  id?: string
  RqUID?: string
  ConversationId?: string
  TransactionResponseDt?: string
  TransactionTime?: string
  UserId?: string
  Errors?: Array<Errors>
  CMMParams?: Array<{ id: string }>
  AdditionalParams?: Array<{ id: string }>
  XFDF?: Array<{ id: string }>
  TransactionResponseTm?: string
}

type Errors = {
  id?: string
  TypeCd?: string
  Error?: Array<Error>
}

type Error = {
  id?: string
  Name?: string
  Msg?: string
  Severity?: string
  Type?: string
}
