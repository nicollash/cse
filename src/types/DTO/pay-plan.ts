export type DTOARPayPlan = {
  AlwaysRollFirstInd?: string
  AutomaticReinstatementThreshholdPct?: string
  BillMethod?: string
  CancelDays?: string
  CancelEffectiveCarryDtInd?: string
  CancelModeCd?: string
  CarryBalanceForwardInd?: string
  CarryBalanceForwardSpreadCd?: string
  DTOARSchedule?: Array<DTOARSchedule>
  DayOfMonthInd?: string
  DelayRollDays?: string
  DueDays?: string
  EquityCancelDays?: string
  EquityLegalDays?: string
  InstallmentFee?: string
  LegalDays?: string
  LegalModeCd?: string
  PayPlan?: string
  PayPlanCd?: string
  PayPlanItems?: string
  PayPlanTypeCd?: string
  PolicyChangeCancelDays?: string
  PolicyChangeDueDays?: string
  PolicyChangeLegalDays?: string
  PolicyChangeModeCd?: string
  PolicyFee?: string
  PremiumWaiverCreditAmt?: string
  PremiumWaiverDebitAmt?: string
  ProductPayPlanCd?: string
  RenewalActivateThresholdPctg?: string
  RevisedInvoiceMinimumDaysBeforeDueDt?: string
  StatementTypeCd?: string
  TaxRate?: string
  TypeCd?: string
  id?: string
}

export type DTOARSchedule = {
  Amount?: string
  Basis?: string
  BillAmt?: string
  CancelDays?: string
  CategoryCd?: string
  CommissionAmt?: string
  DTOARApply?: Array<DTOARApply>
  Desc?: string
  DueDays?: string
  DueDt?: string
  GrossAmt?: string
  HoldInd?: string
  LeadDays?: string
  LegalDays?: string
  NetAmt?: string
  Number?: string
  Percentage?: string
  RollDays?: string
  RollDt?: string
  RollMonths?: string
  StatusCd?: string
  id?: string
}

type DTOARApply = {
  Amount?: string
  CategoryCd?: string
  CommissionAmt?: string
  id?: string
}
