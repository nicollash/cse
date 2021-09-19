import { PartyInfo } from './party'

export type DTOProvider = {
  id?: string
  Contact?: Array<Contact>
  SystemId?: string
  ProviderNumber?: string
  IndexName?: string
  Status?: string
  EntityTypeCd?: string
  Version?: string
  PreferredDeliveryMethod?: string
  PartyInfo?: Array<PartyInfo>
}

type Contact = {
  PartyInfo?: Array<PartyInfo>
  Status?: string
  id?: string
}
