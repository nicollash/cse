import { DriverInfo, DTOApplication, QuoteResponse } from '~/types'
import { httpClient } from '~/utils'
import { config } from '~/config'

export const addDriver = (NewDriver: DriverInfo, DTOApplication: DTOApplication[]) =>
  httpClient<QuoteResponse>(`${config.apiBaseURL}/UpdateQuickQuoteRq/json`, 'POST', {
    NewDriver,
    DTOApplication,
  })

  export const updateDriverPoints = (LoginId: string, NewDriverPoint: any, DTOApplication: Array<DTOApplication>) =>
  httpClient<QuoteResponse>(`${config.apiBaseURL}/QQExternalDriverPointsSaveRq/json`, 'POST', {
    LoginId,
    ...NewDriverPoint,
    DTOApplication,
  })
