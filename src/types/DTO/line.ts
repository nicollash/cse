import { ValidationError } from '../info'
import { Address } from './address'
import { QuestionReplies } from './question-replies'

export type DTOLine = {
  id?: string
  StatusCd?: string
  LineCd?: string
  FullTermAmt?: string
  RatingService?: string
  WrittenPremiumAmt?: string
  EarnedAmt?: string
  CommissionAmt?: string
  FinalPremiumAmt?: string
  TransactionCommissionAmt?: string
  DTORisk?: Array<DTORisk>
  MedPayLimit?: string
  BILimit?: string
  PDLimit?: string
  UMBILimit?: string
  Discount?: Array<Discount>
  MultiPolicyDiscountInd?: string
  WaivePolicyFeeInd?: string
  MultiCarDiscountInd?: string
  UMPDWCDInd?: string
  MultiPolicyDiscount2Ind?: string
  CSEEmployeeDiscountInd?: string
  TwoPayDiscountInd?: string
  RelatedPolicyNumber?: string
  RelatedPolicyNumber2?: string
}

export type DTORisk = {
  id?: string
  TypeCd?: string
  FullTermAmt?: string
  FinalPremiumAmt?: string
  WrittenPremiumAmt?: string
  CommissionAmt?: string
  TransactionCommissionAmt?: string
  Status?: string
  Description?: string
  RiskBeanName?: string
  DTOCoverage?: Array<DTOCoverage>
  RiskAddDt?: string
  RiskAddPolicyVersion?: string
  RiskAddTransactionNo?: string
  DTOBuilding?: Array<DTOBuilding>
  QuestionReplies?: Array<QuestionReplies>
  DTOGLClass?: Array<DTOGLClass>
  DTOVehicle?: Array<DTOVehicle>
  Discount?: Array<Discount>
  DTOValidationError?: Array<ValidationError>
}

type DTOCoverage = {
  id?: string
  Status?: string
  CoverageCd?: string
  FullTermAmt?: string
  WrittenPremiumAmt?: string
  FinalPremiumAmt?: string
  EarnedAmt?: string
  CommissionPct?: string
  ContributionPct?: string
  CommissionAmt?: string
  TransactionCommissionAmt?: string
  Description?: string
  CoinsurancePct?: string
  DTOLimit?: Array<DTOLimit>
  DTOSteps?: Array<DTOSteps>
  DTODeductible?: Array<DTODeductible>
}

type DTOLimit = {
  id?: string
  LimitCd?: string
  TypeCd?: string
  Value?: string
}

type DTOStep = {
  id?: string
  Order?: string
  Name?: string
  Desc?: string
  Operation?: string
  Factor?: string
  Value?: string
  Status?: string
}

type DTOSteps = {
  id?: string
  DTOStep?: Array<DTOStep>
}

type DTOBuilding = {
  id?: string
  Addr?: Array<Address>
}

type DTOGLClass = {
  id?: string
  Addr?: Array<Address>
}

type DTODriverLink = {
  id?: string
  DriverRef?: string
  SystemDriverRef?: string
}

type DTOVehicle = {
  id?: string
  VehNumber?: string
  Status?: string
  Manufacturer?: string
  Model?: string
  ModelYr?: string
  VehIdentificationNumber?: string
  ValidVinInd?: string
  RegistrationStateProvCd?: string
  VehBodyTypeCd?: string
  PerformanceCd?: string
  RestraintCd?: string
  AntiBrakingSystemCd?: string
  AntiTheftCd?: string
  EngineSize?: string
  EngineCylinders?: string
  EngineHorsePower?: string
  EngineType?: string
  VehUseCd?: string
  GarageTerritory?: string
  CollisionDed?: string
  ComprehensiveDed?: string
  SymbolCode?: string
  ClassCd?: string
  Addr?: Array<Address>
  RatingValue?: string
  EstimatedAnnualDistance?: string
  LeasedVehInd?: string
  DTODriverLink?: Array<DTODriverLink>
  NewOrUsedInd?: string
  DaysPerWeekDriven?: string
  TowingAndLaborInd?: string
  LiabilityWaiveInd?: string
  RentalReimbursementInd?: string
  RateFeesInd?: string
  PerformanceOverrideInd?: string
  ReportedPerformanceCd?: string
  RACMPRatingValue?: string
  RACOLRatingValue?: string
  RABIRatingSymbol?: string
  RAPDRatingSymbol?: string
  RAMedPayRatingSymbol?: string
  Bundle?: string
  LoanLeaseGap?: string
  EquivalentReplacementCost?: string
  OriginalEquipmentManufacturer?: string
  OptionalRideshare?: string
  MedicalPartsAccessibility?: string
  Mileage?: string
  VehAddDt?: string
  FullGlassCovInd?: string
  ProgramTypeCd?: string
  ReportedMileageSourceTypeCd?: string
  ReportedMileageReading?: string
  EstimatedAnnualDistanceOverride?: string
  OriginalEstimatedAnnualMiles?: string
  ReportedMileageNonSave?: string
  EstimatedAnnualDistanceCommuteOverride?: string
  PurchasedWithin30Days?: string
  CarfaxMileageType?: string
  PurchaseDt?: string
  EstimatedWorkDistance?: string
  OdometerReading?: string
  ReportedMileageNonSaveDt?: string
  CostNewAmt?: string
  VerifiedMileageOverride?:string
}

type Discount = {
  id?: string
  Description?: string
  DiscountAmt?: string
  StatusCd?: string
  AppliedInd?: string
  TypeCd?: string
  SortOrder?: string
}

type DTODeductible = {
  id?: string
  DeductibleCd?: string
  TypeCd?: string
  Value?: string
}
