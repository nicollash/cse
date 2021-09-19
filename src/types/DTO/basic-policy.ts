import { DTOCommissionArea } from './commission'
import { ElectronicPaymentSource } from './common'

export type DTOBasicPolicy = {
  id?: string
  CarrierGroupCd?: string
  CarrierCd?: string
  ControllingStateCd?: string
  TransactionCd?: string
  InceptionDt?: string
  InceptionTm?: string
  EffectiveDt?: string
  EffectiveTm?: string
  ExpirationDt?: string
  RatedInd?: string
  ProviderRef?: string
  Commission?: string
  PayPlanCd?: string
  PolicyVersion?: string
  TransactionNumber?: string
  TransactionCommissionAmt?: string
  RenewalTermCd?: string
  Branch?: string
  QuoteNumber?: string
  QuoteNumberLookup?: string
  ProductVersionIdRef?: string
  FullTermAmt?: string
  WrittenPremiumAmt?: string
  FinalPremiumAmt?: string
  SubTypeCd?: string
  Description?: string
  ProviderNumber?: string
  WrittenFeeAmt?: string
  WrittenCommissionFeeAmt?: string
  DisplayDescription?: string
  ElectronicPaymentSource?: Array<ElectronicPaymentSource>
  DTOCommissionArea?: Array<DTOCommissionArea>
  PersistencyDiscountDt?: string
  ConversionSourceCd?: string
  CompanyCd?: string
  ProgramInd?: string
  TabPolicyDirty?: string
  TabPrimaryCoAppAdditionalDirty?: string
  TabAutoGeneralDirty?: string
  TabUnderwritingDirty?: string
  TabDriversDirty?: string
  TabRisksDirty?: string
  TabLossHistoryDirty?: string
  TabVehiclesDirty?: string
  TabPersonalUmbrellaDirty?: string
  TabAdditionalInterestsDirty?: string
  TabReviewDirty?: string
  TabOperatorsDirty?: string
  CDCredit?: string
  QuotedPremiumForCompRater?: string

  PolicyNumber?: string
  AffinityGroupCd?:string
}
