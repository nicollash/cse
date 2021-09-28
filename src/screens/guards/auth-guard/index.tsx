
import { jsx } from '@emotion/react'
import { Fragment, FunctionComponent, useEffect } from 'react'
import { useRouter } from 'next/router'

import { LoginModal } from '~/screens/modals'
import { useAuth } from '~/hooks'
import { Loading } from '~/components'

export const AuthGuard: FunctionComponent<{
  isLoggedIn: boolean
}> = ({ isLoggedIn, children }) => {
  const { lastAttemptCredentials, previousLogout} = useAuth()
  const router = useRouter()
  let logoutMessage = 'You have logged out of this session';
  let localPreviousLogout = previousLogout;

  return (
    <Fragment>
      {children}
      <LoginModal isOpen={!isLoggedIn} defaultValue={lastAttemptCredentials} fromLogout={localPreviousLogout} fromLogoutMessage={logoutMessage} />
    </Fragment>
  )
}
