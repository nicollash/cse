
import { jsx } from '@emotion/react'
import { FunctionComponent, useMemo, useState } from 'react'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { Modal, FormikInput, Button, Hr, Loading } from '~/components'
import { utils } from '~/styles'
import { useAuth, useLocale } from '~/hooks'

import { styles } from './styles'
import { CustomError } from '~/types'

interface LoginModalProps {
  isOpen: boolean
  fromLogout: boolean
  fromLogoutMessage: string
  defaultValue?: any
}

interface UserLoginInput {
  userId: string
  password: string
}

export const LoginModal: FunctionComponent<LoginModalProps> = ({
  defaultValue,
  isOpen,
  fromLogout,
  fromLogoutMessage,
  ...props
}) => {
  const { locale, messages } = useLocale()
  const { login } = useAuth()
  const [localErrorMessage, setLocalErrorMessage] = useState('')

  const [isLoading, setLoading] = useState(false)

  const schema = useMemo(
    () =>
      Yup.object().shape({
        userId: Yup.string()
          .label('User Name')
          .required(messages.Login.Errors.RequireduserId),
        password: Yup.string()
          .label('Password')
          .required(messages.Login.Errors.RequiredPassword)
          .min(8, messages.Login.Errors.MinLengthPassword),
      }),
    [locale],
  )

  const formik = useFormik<UserLoginInput>({
    validationSchema: schema,
    validateOnMount: false,
    initialValues: {
      userId: (defaultValue && defaultValue.userName) || '',
      password: (defaultValue && defaultValue.password) || '',
    },
    onSubmit: (value) => {
      setLoading(true)
      setLocalErrorMessage('')
      login(value.userId, value.password).finally(() => setLoading(false))
        .catch((e: Array<CustomError>) => {
          try {
            const errorText = e.reduce((previousError, currentError) => {
              let currrentText = currentError.message
              if (currentError.message.includes('401')) {
                currrentText = 'Invalid account or password'
              }
              return previousError.concat(currrentText)
            }, '')
            setLocalErrorMessage(errorText)
          } catch (error) {
            setLocalErrorMessage('Login Error')
            console.log(e)
          }
        })
    },
  })

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={false}
      title={messages.Login.Heading}
      width="580px"
      data-testid="login-modal"
      additionalInfo={fromLogout || (localErrorMessage && localErrorMessage != '')}
      additionalInfoMessage={(!localErrorMessage || localErrorMessage == '') ? fromLogoutMessage : localErrorMessage}
    >

      <FormikProvider value={formik}>
        <form
          css={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit()
          }}
          data-testid="login-form"
          {...props}
        >
          <FormikInput
            data-testid="input-userid"
            name="userId"
            css={[utils.mb(3), utils.fullWidth]}
            placeholder={messages.Login.UserName}
            onChange={(e) => {
              formik.handleChange(e)
            }}
          />
          <FormikInput
            data-testid="input-password"
            name="password"
            css={[utils.fullWidth, utils.mt(5)]}
            type="password"
            onChange={(e) => {
              formik.handleChange(e)
            }}
            placeholder={messages.Login.Password}
          />
          <Hr css={[utils.fullWidth, utils.my(5)]} />
          <Button type="submit" width="110px" data-testid="button-login">
            {messages.Login.Login}
          </Button>
        </form>
      </FormikProvider>

      {isLoading && <Loading />}
    </Modal>
  )
}
