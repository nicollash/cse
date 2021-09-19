export type TAddressObject = {
  address: string
  unitNumber: string
  requiredUnitNumber?: boolean
  status: EAddressObjectStatus
}

export enum EAddressObjectStatus {
  success,
  invalidAddress,
  addressRequired,
  unitNumberRequired,
  invalidUnitNumber,
}
