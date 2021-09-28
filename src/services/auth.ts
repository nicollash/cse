import { httpClient } from '~/utils'
import { config } from '~/config'
import { AuthResponse, TokenStatusResponse } from '~/types'

export const login = (userId: string, password: string): Promise<any> =>
  httpClient(`/api/auth/login`, 'POST', {
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
