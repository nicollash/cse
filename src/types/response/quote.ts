import { Response } from './response'
import { AppMetaData, DTOARPayPlan, DTOApplication } from '../DTO'

export type QuoteResponse = Response<{
  AppMetaData?: Array<AppMetaData>
  DTOARPayPlan?: Array<DTOARPayPlan>
  DTOApplication?: Array<DTOApplication>
  infoReq?: boolean
}>

export type QuickQuoteInfoResponse = Response<{
  QuickQuoteInfo?: Array<QuickQuoteInfo>
}>

export type QuickQuoteInfo = {
  id: string
  QuoteNumber: string
  EffectiveDate: string
  UpdateDt: string
  Premium: string
  InsuredName: string
  InsuredAddress: string
}
