import { httpClient } from '~/utils'
import { config } from '~/config'
import { AuthResponse, TokenStatusResponse } from '~/types'

export const login = (userId: string, password: string) =>
  httpClient<AuthResponse>(`${config.apiBaseURL}/ProviderLoginRq/json`, 'POST', {
    UserId: userId,
    Password: password,
  })

export const logout = () =>
  httpClient<any>(`${config.apiBaseURL}/LogoutTokenRq/json`, 'POST')

export const checkToken = (token: string) =>
  httpClient<TokenStatusResponse>(
    `${config.apiBaseURL}/ValidateProviderLoginTokenRq/json`,
    'POST',
    {
      LoginToken: token,
    },
    true,
  )
