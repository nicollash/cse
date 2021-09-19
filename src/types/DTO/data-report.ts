import { PartyInfo } from './party'

export type DataReportRequest = {
  id?: string
  TemplateIdRef?: string
  DataReportRef?: string
  DataReportSourceCd?: string
  StatusCd?: string
  AddDt?: string
  AddTm?: string
  AddUser?: string
  RequestTypeCd?: string
  SourceIdRef?: string
  CopyOnRenewal?: string
  AutoPrefill?: Array<AutoPrefill>
  VehId?: string
}

type AutoPrefill = {
  id?: string
  ClientId?: string
  ModelName?: string
  SystemIdRef?: string
  ContainerKey?: string
  StatusCd?: string
  ReturnedVehiclesStatus?: string
  NumberOfVehicles?: string
  PartyInfo?: Array<PartyInfo>
  ReturnedDriversStatus?: string
  NumberOfDrivers?: string
}
