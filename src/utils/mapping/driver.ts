import { DriverInfo } from '~/types'

import { convertDateToString } from './helpers'

export const getNewDriverParam = (driverData: DriverInfo) => ({
  FirstName: driverData.firstName,
  LastName: driverData.lastName,
  BirthDate: convertDateToString(driverData.birthDate),
  Gender: driverData.gender,
  MaritalStatus: driverData.maritalStatus,
  Occupation: driverData.occupation,
  LicenseState: driverData.licenseState,
  LicenseNumber: driverData.licenseNumber || '',
  PartyTypeCd: driverData.partyTypeCd || 'DriverParty',
  AgeFirstLicensed:
    driverData.ageFirstLicensed
})
