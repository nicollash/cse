
import { jsx } from '@emotion/react'
import { Fragment, FunctionComponent, useEffect } from 'react'
import { useRouter } from 'next/router'

import { LoginModal } from '~/screens/modals'
import { useAuth } from '~/hooks'
import { Loading } from '~/components'

export const AuthGuard: FunctionComponent<{
  shouldRedirect?: boolean
}> = ({ shouldRedirect = true, children }) => {
  const { isInitialized, isAuthenticated, lastAttemptCredentials, previousLogout} = useAuth()
  const router = useRouter()
  let logoutMessage = 'You have logged out of this session';
  let localPreviousLogout = previousLogout;

  useEffect(() => {  
    if (isInitialized && !isAuthenticated && shouldRedirect) {
      router.push('/')
    }
  }, [isInitialized, isAuthenticated, shouldRedirect])

  if (!isInitialized) {
    return <Loading />
  }

  return (
    <Fragment>
      {children}
      <LoginModal isOpen={!isAuthenticated} defaultValue={lastAttemptCredentials} fromLogout={localPreviousLogout} fromLogoutMessage={logoutMessage} />
    </Fragment>
  )
}
