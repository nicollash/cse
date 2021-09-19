import { DTOBasicPolicy } from './basic-policy'
import { DTOFee } from './fee'
import { DTOForm } from './form'
import { DTOInsured } from './insured'
import { DTOLine } from './line'
import { DTOLocation } from './location'
import { PartyInfo } from './party'
import { QuestionReplies } from './question-replies'

export type DTOPolicy = {
  AccountRef?: string
  BasicPolicy?: Array<DTOBasicPolicy>
  ChangeInfo?: Array<any>
  CustomerRef?: string
  DataReportRequest?: Array<any>
  Fee?: Array<DTOFee>
  Form?: Array<DTOForm>
  Insured?: Array<DTOInsured>
  Line?: Array<DTOLine>
  Location?: Array<DTOLocation>
  Output?: Array<any>
  PartyInfo?: Array<PartyInfo>
  PolicyReinsurance?: Array<any>
  QuestionReplies?: Array<QuestionReplies>
  SystemId?: string
  UpdateCount?: string
  UpdateTimestamp?: string
  UpdateUser?: string
  Version?: string
  id?: string
}
