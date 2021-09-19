import { Response } from './response'
import { DTOProvider } from '../DTO'

export type AuthResponse = Response<{
  LoginToken?: string
  ProviderLogin?: ProviderLogin
  DTOProvider?: DTOProvider
  ResponseParams?: Array<Params>
}>

type Params = Response<{
  ConversationId: string
}>

export type TokenStatusResponse = Response<{
  LoginToken?: string
  tokenStatus: 'Valid' | 'Invalid'
}>

export type ProviderLogin = {
  SystemId?: string
  id?: string
  UpdateCount?: string
  UpdateUser?: string
  UpdateTimestamp?: string
  UserId?: string
  StatusCd?: string
  LastLogonDt?: string
  LastLogonTm?: string
  TermAcceptInd?: string
  TermAcceptDt?: string
  LanguageCd?: string
  AddDt?: string
  AddTm?: string
  ExpirationDt?: string
  ChangePasswordAtLogonInd?: string
  LinkReference?: Array<LinkReference>
  LoginCounter?: string
  SkipLinkOtherPolicyInd?: string
  SkipPaperlessDeliveryInd?: string
  OpeningPage?: string
}

type LinkReference = {
  id?: string
  SystemIdRef?: string
  ModelName?: string
  Description?: string
  Status?: string
}
