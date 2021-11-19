import { ProviderLogin } from './response/login'
import { DTOProvider, Address } from './DTO'
import { TAddressObject } from './address'
import { PaymentInfo } from './DTO/common'

export type AddVehicleByVIN = {
  vinNumber?: string
}

export type AddVehicleByData = {
  year?: string
  make?: string
  model?: string
}

export type AddVehicle = AddVehicleByVIN | AddVehicleByData

export type PlanType = 'Basic' | 'Standard' | 'Premium'
export const PlanTypes: PlanType[] = ['Basic', 'Standard', 'Premium']

export type VehicleInfo = {
  id?: string
  vinNumber?: string
  vehNumber?: string
  year?: string
  make?: string
  model?: string
  status?: string

  comprehensive?: string
  collisionDeductible?: string
  symbolCode?: string

  condition?: string
  leasedOrPurchased?: string
  purchaseDate?: Date
  primaryDriver?: string
  primaryUse?: string
  milesDriven?: string
  costNew?: string
  annualMileage?: string
  estimateAnnualMiles?: string
  recommendedMileage?: string
  verifiedMileageOverride?:string

  differentGaragingZip?: boolean
  garagingZip?: string

  odometerReading?: number
  readingDate?: Date

  parentRiskId?: string
  questions?: Array<QuestionReply>
}

export type DriverInfo = {
  id?: string
  firstName?: string
  lastName?: string
  age?: number
  birthDate?: Date
  originalBirthDate?: Date
  gender?: string
  maritalStatus?: string
  occupation?: string
  licenseState?: string
  licenseNumber?: string
  originalLicenseNumber?: string
  licenseDt?: string
  ageFirstLicensed?: number
  status?: string
  driverPoints?: Array<DriverPointsInfo>
  matureDriverInd?:boolean
  matureCertificationDt?: Date
  scholasticDiscountInd?: boolean
  scholasticCertificationDt?:Date
  partyTypeCd?: string
  driverTypeCd?: string
  relationshipToInsuredCd?: string
}

export type DriverPointsInfo = {
  DriverId?: string,
  id?: string,
  status?: string,
  driverPointsNumber?: string,
  sourceCd?: string,
  infractionCd?: string,
  infractionDt?: Date,
  pointsChargeable?: string,
  pointsCharged?: string,
  expirationDt?: Date,
  comments?: string,
  convictionDt?: Date,
  typeCd?: string,
  addedByUserId?: string,
  goodDriverPoints?: string
}

export type DiscountInfo = {
  applied?: string
  description?: string
  sortOrder?: string
  id?: string
}

export type Coverage = {
  description?: string
  amount?: string
}

export type CarCoverageInfo = {
  id?: string
  vinNumber?: string
  vehNumber?: string
  year?: string
  make?: string
  model?: string
  status?: string

  comprehensive?: string
  collisionDeductible?: string
  dailyRentalCarLimit?: string
  medicalPartsAndAccessibility?: string
  roadsideAssistance?: boolean | null
  fullGlass?: boolean | null
  loanLeaseGap?: boolean | null
  originalReplacementCost?: boolean | null
  waiveLiability?: boolean | null

  coverages?: Array<Coverage>
  parentRiskId?: string
}

export type FeeInfo = {
  description?: string
  amount?: string
}

export type QuoteDetail = {
  infoReq: boolean
  systemId: string
  // Vehicle Info
  vehicles: Array<VehicleInfo>
  // Driver Info
  drivers: Array<DriverInfo>
  // Discount Info
  discounts: Array<DiscountInfo>

  insurerFirstName: string
  insurerLastName: string
  insuredAddress: Address
  customerRef: string

  lineInfo: LineInfo
  basicPolicyInfo: BasicPolicyInfo

  communicationInfo: CommunicationInfo

  additionalInterest: Array<AdditionalInterestInfo>

  lossHistory: Array<LossHistoryInfo>

  validationError: Array<ValidationError>

  uwQuestions: Array<QuestionReply>

  // PlansInfo
  planInfo?: {
    Basic: PlanInfo
    Standard: PlanInfo
    Premium: PlanInfo
  }
  // Payment Info
  // Review Info
  planDetails?:PlanInfo
}

export type PlanInfo = {
  applicationNumber?: string
  systemId?: string
  isQuote?: boolean

  planType?: PlanType
  renewalTerm?: string
  paymentPlan?: string
  paymentSchedule?: Array<PaymentScheduleItem>
  monthlyPrice?: string
  downPayment?: string
  fullPrice?: string
  totalPremiumPrice?: string
  effectiveDate: Date
  bodilyInjuryLimit?: string
  uninsuredMotoristLimit?: string
  medicalPaymentsLimit?: string
  UM_PD_WCD_Applies?: string
  propertyDamage?: string
  writtenFeeAmt?:string

  vehicleInfo?: Array<CarCoverageInfo>

  paymentMethod?: PaymentInfo
  installmentFee?:string

  // Fee Info
  fees?: Array<FeeInfo>
}

export type PaymentScheduleItem = {
  BillAmt: string
}

export const DefaultDriverInfo = {
  id: null,
  firstName: '',
  lastName: '',
  birthDate: null,
  gender: 'Male',
  maritalStatus: 'Single',
  occupation: 'Non-Civil Servant',
  driverTypeCd: 'Excluded',
  licenseState: '',
  licenseNumber: '',
  ageFirstLicensed: 16,
  driverPoints: []
}

export interface UserAddressInput {
  firstName: string
  lastName: string
  address: TAddressObject
}

export interface UserInfo {
  LoginToken: string
  ProviderLogin: ProviderLogin
  DTOProvider: DTOProvider
  LoginId: string
}

export type InsurerInfo = {
  firstName: string
  lastName: string
  address: TAddressObject
}

export type LineInfo = {
  multiPolicyDiscountInd: string
  relatedPolicyNumber: string
  multiPolicyDiscount2Ind: string
  relatedPolicyNumber2: string
}

export type BasicPolicyInfo = {
  programInd: string
  affinityGroupCd: string
}

export type OneIncPaymentInfo = {
  sessionId: string
  tokenId: string
  lastFourDigits: string
  customerName: string
  transactionDate: string
  timezone: string
  paymentCategory: string
  cardType: string
  cardExpirationMonth: number
  cardExpirationYear: number
  holderZip: string
}

export type SavePaymentRequestInfo = {
  sessionId: string,
  tokenId: string,
  lastFourDigits: string,
  customerName: string,
  transactionDate: string,
  timeZone: string,
  paymentCategory: string,
  cardType: string,
  cardExpirationMonth: number,
  cardExpirationYear: number,
  holderZip: number
}

export type CommunicationInfo = {
  email: string
  phone: string
}

export type LinkReference = {
  id: string,
  vehiculeId: string,
  idRef: string,
  modelName: string,
  description: string
  status: string
}

export type AdditionalInterestInfo = {
  id: string
  sequenceNumber: string
  interestTypeCd: string
  legalLanguage?: string
  accountNumber: string
  interestFormCd?: string
  interestName: string
  status: string
  preferredDeliveryMethod: string
  partyInfo: {
    phone?: string,
    phoneType?: string
    mailToName?: string
    addr: Address
  },
  linkReference: Array<AdditionalInterestLinkReferenceInfo>
}

export type AdditionalInterestLinkReferenceInfo = {
  id?: string,
  idRef?: string,
  modelName?: string,
  year?: string,
  make?: string,
  model?: string,
  description?: string,
  status?: boolean
}

export type LossHistoryInfo = {
  LossHistoryNumber: string,
  LossDt?: Date,
  LossCauseCd: string,
  ClaimNumber?: string,
  ClaimStatusCd?: string,
  CatastropheNumber?: string,
  CarrierName?: string,
  TypeCd?: string,
  PolicyNumber?: string,
  LossAmt?: string,
  PaidAmt?: string,
  VehIdentificationNumber?: string,
  AtFaultCd?: string,
  DriverName: string,
  DriverLicensedStateProvCd?: string,
  DriverLicenseNumber?: string,
  OriginalDriverLicenseNumber?: string,
  Comment?: string,
  LossDesc?: string,
  id?: string,
  StatusCd?: string,
  SourceCd?: string
  PolicyTypeCd?: string
}

export type ValidationError = {
  id?: string,
  TypeCd?: string,
  Msg?: string,
  SubTypeCd?: string,
  PermanentInd?: string,
  Link?: string
}

export type QuestionReply = {
  id?: string
  Name?: string
  VisibleInd?: string
  Value?: string
}
