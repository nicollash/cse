import { PartyInfo } from './party'

export type DTOInsured = {
  id?: string
  IndexName?: string
  EntityTypeCd?: string
  PreferredDeliveryMethod?: string
  PartyInfo?: Array<PartyInfo>
  InsuranceScore?: Array<InsuranceScore>
}

type InsuranceScore = {
  id?: string
  InsuranceScoreTypeCd?: string
}
