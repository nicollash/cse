import { DTOApplication } from '~/types'
import { config } from '~/config'
import { httpClient } from '~/utils'

export const oneIncInvokePortal = (req: {
  OperationType: string
  ApplicationRef: string
  PaymentMethodCd: string
}) => httpClient<any>(`${config.apiBaseURL}/COOneIncInvokePortalRq/json`, 'POST', req)

export const issuePolicy = (LoginId: string, DTOApplication: DTOApplication[]) =>
  httpClient<any>(`${config.apiBaseURL}/IssueQuickQuoteIntoPolicyRq/json`, 'POST', {
    LoginId,
    DTOApplication,
  })
