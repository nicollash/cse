import { config } from '~/config'
import { httpClient } from '~/utils'
import {
  DTOApplication,
  DTORisk,
  MakeModelResponse,
  NewRiskResponse,
  QuoteResponse,
} from '~/types'

export const getMakeList = (year: string) =>
  httpClient<MakeModelResponse>(
    `${config.apiBaseURL}/GetVinManufacturerSelectListRq/json`,
    'POST',
    {
      ModelYear: year,
    },
  ).then((res) => {
    return res.Option?.map((el) => ({ label: el.Name, value: el.Name })) || []
  })

export const getModelList = (year: string, make: string) =>
  httpClient<MakeModelResponse>(
    `${config.apiBaseURL}/GetVinModelSelectListRq/json`,
    'POST',
    {
      ModelYear: year,
      Manufacturer: make,
    },
  ).then((res) => {
    return res.Option?.map((el) => ({ label: el.Name, value: el.Value })) || []
  })

export const getRiskByVIN = (VIN: string) =>
  httpClient<NewRiskResponse>(`${config.apiBaseURL}/GetRiskByVehicleIdRq/json`, 'POST', {
    VIN,
  })

export const getRiskByModelSystemID = (ModelSystemId: string) =>
  httpClient<NewRiskResponse>(
    `${config.apiBaseURL}/GetRiskByVehicleModelRq/json`,
    'POST',
    {
      ModelSystemId,
    },
  )

export const addVehicle = (DTORisk: DTORisk, DTOApplication: DTOApplication[]) =>
  httpClient<QuoteResponse>(`${config.apiBaseURL}/UpdateQuickQuoteRq/json`, 'POST', {
    DTORisk,
    DTOApplication,
  })
