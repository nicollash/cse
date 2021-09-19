export type ElectronicPaymentSource = {
  id?: string
  SourceTypeCd?: string
  MethodCd?: string,
  CreditCardNumber?: string,
  CreditCardTypeCd?: string,
  CreditCardHolderName?: string,
  OneIncPaymentToken?: string
  ACHBankName?: string
  ACHBankAccountNumber?: string
  ACHBankAccountTypeCd?: string
}

export type PaymentInfo = {
  id?: string
  sourceTypeCd?: string
  paymentCategory?: string,
  lastFourDigits?: string,
  cardType?: string,
  creditCardHolderName?: string,
  oneIncPaymentToken?: string
  bankName?: string
  accountType?: string
}
