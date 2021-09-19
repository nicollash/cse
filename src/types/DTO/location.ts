import { Address } from './address'

export type DTOLocation = {
  id?: string
  LocationNumber?: string
  Status?: string
  LocationDesc?: string
  DTOLocationRiskGroup?: Array<DTOLocationRiskGroup>
  Addr?: Array<Address>
}

type DTOLocationRiskGroup = {
  id?: string
  RiskGroupCd?: string
}
