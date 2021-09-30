import { config } from '~/config'
import { httpClient } from '~/frontend/utils'

export const shareQuote = (LoginId: string, EmailId: string, ApplicationRef: string) =>
  httpClient<any>(`${config.apiBaseURL}/QQSendQuoteInfoEmailRq/json`, 'POST', {
    LoginId,
    EmailId,
    ApplicationRef
  })
