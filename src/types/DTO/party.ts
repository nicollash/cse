import { Address } from './address'

export type PartyInfo = {
  id?: string
  PartyTypeCd?: string
  Status?: string
  PersonInfo?: Array<PersonInfo>
  BusinessInfo?: Array<BusinessInfo>
  DriverInfo?: Array<DriverInfo>
  TaxInfo?: Array<TaxInfo>
  PhoneInfo?: Array<PhoneInfo>
  EmailInfo?: Array<EmailInfo>
  NameInfo?: Array<NameInfo>
  Addr?: Array<Address>
}

type EmailInfo = {
  id?: string
  EmailTypeCd?: string
  EmailAddr?: string
  PreferredInd?: string
}

type NameInfo = {
  id?: string
  NameTypeCd?: string
  GivenName?: string
  Surname?: string
  CommercialName?: string
  IndexName?:string
}

type PersonInfo = {
  id?: string
  PersonTypeCd?: string
  BirthDt?: string
  CivilServantInd?: string
  GenderCd?: string
  MaritalStatusCd?: string
  OccupationClassCd?: string
  Age?: string
  YearsLicensed?: string
  PositionTitle?: string
}

type BusinessInfo = {
  id?: string
  BusinessInfoCd?: string
  Occupation?: string
}

type PhoneInfo = {
  id?: string
  PhoneTypeCd?: string
  PhoneNumber?: string
  PreferredInd?: string
  PhoneName?: string
}

type DriverInfo = {
  id?: string
  DriverInfoCd?: string
  DriverNumber?: string
  DriverStatusCd?: string
  LicenseNumber?: string
  LicenseDt?: string
  DriverTypeCd?: string
  AgeFirstLicensed?: number
  LicensedStateProvCd?: string
  RelationshipToInsuredCd?: string
  DriverStartDt?: string
  MVRRequestInd?: string
  AttachedVehicleRef?: string
  GoodDriverInd?: string
  MatureDriverInd?: string
  MatureCertificationDt?: string
  ScholasticDiscountInd?:string
  ScholasticCertificationDt?: string
  DriverPoints?: Array<DriverPointsInfo>
}

type DriverPointsInfo = {
  id?: string,
  Status?: string,
  DriverPointsNumber?: string,
  SourceCd?: string,
  InfractionCd?: string,
  InfractionDt?: string,
  PointsChargeable?: string,
  PointsCharged?: string,
  ExpirationDt?: string,
  Comments?: string,
  ConvictionDt?: string,
  TypeCd?: string,
  AddedByUserId?: string,
  GoodDriverPoints?: string
}

type TaxInfo = {
  id?: string
  TaxTypeCd?: string
  SSN?: string
}
