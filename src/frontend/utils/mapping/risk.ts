import { DTORisk, VehicleInfo } from '~/types'

import {
  getCorrectVinNumber,
  getPostalCode,
  convertStringToDate,
  convertDateToString,
} from './helpers'

export const parseRisk = (risk: DTORisk): VehicleInfo => ({
  id: risk.DTOVehicle[0].id,
  vinNumber: getCorrectVinNumber(risk.DTOVehicle[0].VehIdentificationNumber),
  vehNumber: risk.DTOVehicle[0].VehNumber,
  year: risk.DTOVehicle[0].ModelYr,
  make: risk.DTOVehicle[0].Manufacturer,
  model: risk.DTOVehicle[0].Model,
  status: risk.DTOVehicle[0].Status,

  condition: risk.DTOVehicle[0].NewOrUsedInd,
  leasedOrPurchased: risk.DTOVehicle[0].LeasedVehInd,
  purchaseDate: convertStringToDate(risk.DTOVehicle[0].PurchaseDt),
  primaryDriver:
    (risk.DTOVehicle[0].DTODriverLink && risk.DTOVehicle[0].DTODriverLink[0].DriverRef) ||
    null,
  primaryUse: risk.DTOVehicle[0].VehUseCd,
  milesDriven: risk.DTOVehicle[0].EstimatedWorkDistance,
  costNew: risk.DTOVehicle[0].CostNewAmt,
  annualMileage: risk.DTOVehicle[0].Mileage,
  estimateAnnualMiles: risk.DTOVehicle[0].OriginalEstimatedAnnualMiles,
  recommendedMileage: risk.DTOVehicle[0].ReportedMileageNonSave,
  verifiedMileageOverride: risk.DTOVehicle[0].VerifiedMileageOverride,
  comprehensive: risk.DTOVehicle[0].ComprehensiveDed,
  collisionDeductible: risk.DTOVehicle[0].CollisionDed,
  symbolCode: risk.DTOVehicle[0].SymbolCode,

  differentGaragingZip: !getPostalCode(risk),
  garagingZip: getPostalCode(risk),

  odometerReading: risk.DTOVehicle[0].OdometerReading
    ? +risk.DTOVehicle[0].OdometerReading
    : undefined,
  readingDate:
    convertStringToDate(risk.DTOVehicle[0].ReportedMileageNonSaveDt) || undefined,
  
  parentRiskId: risk.id,
  questions: risk.QuestionReplies && risk.QuestionReplies.length && risk.QuestionReplies[0].QuestionReply ?  risk.QuestionReplies[0]?.QuestionReply : []
})

export const getUpdatedRisk = (risk: DTORisk, vehicleInfo: VehicleInfo) => {
  if (
    getCorrectVinNumber(risk.DTOVehicle[0].VehIdentificationNumber) !== '' ||
    vehicleInfo.vinNumber
  ) {
    risk.DTOVehicle[0].VehIdentificationNumber = vehicleInfo.vinNumber
  }
  risk.Status = vehicleInfo.status
  risk.DTOVehicle[0].Status = vehicleInfo.status

  risk.DTOVehicle[0].NewOrUsedInd = vehicleInfo.condition
  risk.DTOVehicle[0].LeasedVehInd = vehicleInfo.leasedOrPurchased
  risk.DTOVehicle[0].PurchaseDt = convertDateToString(vehicleInfo.purchaseDate)
  
  risk.DTOVehicle[0].ModelYr = vehicleInfo.year
  risk.DTOVehicle[0].Manufacturer = vehicleInfo.make
  risk.DTOVehicle[0].Model = vehicleInfo.model

  if(vehicleInfo.questions && vehicleInfo.questions.length){
    risk.QuestionReplies[0].QuestionReply = vehicleInfo.questions
  }  

  if (risk.DTOVehicle[0].DTODriverLink && risk.DTOVehicle[0].DTODriverLink[0]) {
    risk.DTOVehicle[0].DTODriverLink[0].DriverRef = vehicleInfo.primaryDriver
    risk.DTOVehicle[0].DTODriverLink[0].SystemDriverRef = vehicleInfo.primaryDriver
  } else {
    risk.DTOVehicle[0].DTODriverLink = [
      {
        DriverRef: vehicleInfo.primaryDriver,
        SystemDriverRef: vehicleInfo.primaryDriver,
      },
    ]
  }

  risk.DTOVehicle[0].VehUseCd = vehicleInfo.primaryUse
  risk.DTOVehicle[0].EstimatedWorkDistance = vehicleInfo.milesDriven
  risk.DTOVehicle[0].CostNewAmt = vehicleInfo.costNew
  risk.DTOVehicle[0].Mileage = vehicleInfo.annualMileage
  risk.DTOVehicle[0].OriginalEstimatedAnnualMiles = vehicleInfo.estimateAnnualMiles
  risk.DTOVehicle[0].EstimatedAnnualDistance = vehicleInfo.recommendedMileage


  risk.DTOVehicle[0].ComprehensiveDed = vehicleInfo.comprehensive
  risk.DTOVehicle[0].CollisionDed = vehicleInfo.collisionDeductible
  risk.DTOVehicle[0].SymbolCode = vehicleInfo.symbolCode

  risk.DTOVehicle[0].OdometerReading = vehicleInfo.odometerReading
    ? vehicleInfo.odometerReading.toString()
    : null
  risk.DTOVehicle[0].ReportedMileageNonSaveDt = vehicleInfo.readingDate
    ? convertDateToString(vehicleInfo.readingDate)
    : null

  if (!vehicleInfo.differentGaragingZip) {
    if (risk.DTOVehicle[0].Addr) {
      const addrIndex = risk.DTOVehicle[0].Addr.findIndex(
        (addr) => addr.AddrTypeCd === 'VehicleGarageAddr',
      )

      if (addrIndex >= 0) {
        risk.DTOVehicle[0].Addr[addrIndex].PostalCode = vehicleInfo.garagingZip
      } else {
        risk.DTOVehicle[0].Addr.push({
          id: 'Addr-Template-ID',
          AddrTypeCd: 'VehicleGarageAddr',
          PostalCode: vehicleInfo.garagingZip,
        })
      }
    } else {
      risk.DTOVehicle[0].Addr = [
        {
          id: 'Addr-Template-ID',
          AddrTypeCd: 'VehicleGarageAddr',
          PostalCode: vehicleInfo.garagingZip,
        },
      ]
    }
  } else {
    if (risk.DTOVehicle[0].Addr) {
      const addrIndex = risk.DTOVehicle[0].Addr.findIndex(
        (addr) => addr.AddrTypeCd === 'VehicleGarageAddr',
      )

      if (addrIndex >= 0) {
        risk.DTOVehicle[0].Addr[addrIndex].PostalCode = null
      }
    }
  }
  return risk
}
