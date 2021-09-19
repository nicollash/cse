import { DTOAI } from './additional-interest'
import { DTOBasicPolicy } from './basic-policy'
import { DTOCommissionArea } from './commission'
import { DataReportRequest } from './data-report'
import { DTOFee } from './fee'
import { DTOForm } from './form'
import { DTOInsured } from './insured'
import { DTOLine } from './line'
import { DTOLocation } from './location'
import { Output } from './output'
import { PartyInfo } from './party'
import { QuestionReplies } from './question-replies'
import { DTOTransactionInfo } from './transaction'
import { DTOLossHistory } from './loss-history'
import { ValidationError } from '../info'

export { DTORisk } from './line'

export type AppMetaData = {
  AppPayPlanId?: string
  AppRef?: string
  QuoteType?: string
  id?: string
}

export type DTOApplication = {
  id?: string
  ApplicationNumber?: string
  Version?: string
  CustomerRef?: string
  Status?: string
  TypeCd?: string
  LockTaskId?: string
  LockTaskOwner?: string
  LockTaskOwnerCd?: string
  Description?: string
  SystemId?: string
  LineCd?: string
  FullTermAmt?: string
  WrittenPremiumAmt?: string
  FinalPremiumAmt?: string
  AddDt?: string
  AddTm?: string
  UpdateDt?: string
  UpdateTm?: string
  CarrierCd?: string
  ControllingStateCd?: string
  TransactionCd?: string
  InceptionDt?: string
  InceptionTm?: string
  EffectiveDt?: string
  EffectiveTm?: string
  ExpirationDt?: string
  DTOInsured?: Array<DTOInsured>
  QuestionReplies?: Array<QuestionReplies>
  DTOLine?: Array<DTOLine>
  DTOLocation?: Array<DTOLocation>
  DTOForm?: Array<DTOForm>
  PartyInfo?: Array<PartyInfo>
  DTOApplicationInfo?: Array<DTOApplicationInfo>
  DTOAI?: Array<DTOAI>
  DTOFee?: Array<DTOFee>
  DTOTransactionInfo?: Array<DTOTransactionInfo>
  Output?: Array<Output>
  DTOBasicPolicy?: Array<DTOBasicPolicy>
  DataReportRequest?: Array<DataReportRequest>
  DTOCommissionArea?: Array<DTOCommissionArea>
  DTOLossHistory?: Array<DTOLossHistory>
  ValidationError?:Array<ValidationError>
}

type DTOApplicationInfo = {
  id?: string
  AddDt?: string
  AddTm?: string
  AddUser?: string
  UpdateDt?: string
  UpdateTm?: string
  UpdateUser?: string
  IterationDescription?: string
  MasterQuoteRef?: string
}
