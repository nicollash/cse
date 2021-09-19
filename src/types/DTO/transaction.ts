import { ElectronicPaymentSource } from './common'

export type DTOTransactionInfo = {
  id?: string
  TransactionCd?: string
  TransactionEffectiveDt?: string
  TransactionShortDescription?: string
  SourceCd?: string
  ElectronicPaymentSource?: Array<ElectronicPaymentSource>
}
