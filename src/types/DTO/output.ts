import { PartyInfo } from './party'

export type Output = {
  id?: string
  DocumentType?: string
  OutputTemplateIdRef?: string
  AddUser?: string
  Status?: string
  Tag?: Array<Tag>
  OutputItem?: Array<OutputItem>
}

type Tag = {
  id?: string
  Name?: string
  TagTemplateIdRef?: string
}
type OutputItem = {
  id?: string
  IncludeInd?: string
  ItemName?: string
  ItemDescription?: string
  Name?: string
  FormCd?: string
  DeliveryCd?: string
  DestinationCd?: string
  DefaultInd?: string
  MailProofCd?: string
  OutputTemplateRecipientIdRef?: string
  DocumentTypeCd?: string
  SourceIdRef?: string
  PartyInfo?: Array<PartyInfo>
}
