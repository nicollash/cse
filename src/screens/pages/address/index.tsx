
import { jsx } from '@emotion/react'
import { FunctionComponent, useEffect, useState, useMemo, useRef } from 'react'
import { RouteProps, useHistory } from 'react-router-dom'

import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { logger, placeAPI } from '~/utils'

import {
  Screen,
  FormikInput,
  Button,
  Heading,
  Container,
  FormikAddressInput,
  FormGroup,
  FormikImagesSwitch,
} from '~/components'
import { utils } from '~/styles'
import { TAddressObject, EAddressObjectStatus, UserAddressInput, CustomError } from '~/types'
import { useError, useLocale, useQuote } from '~/hooks'
import { styles } from './styles'
import { QuoteErrorModal } from '~/screens/modals'
import { isAKnownError } from '~/contexts/error-context'
import { faCar, faHome, faKey, faQuestion } from '@fortawesome/free-solid-svg-icons'

export const AddressScreen: FunctionComponent<RouteProps> = ({ location }) => {
  const router = useRouter()
  const { locale, messages } = useLocale()
  const { generateQuote } = useQuote()

  const isMountedRef = useRef(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [hasQuoteError, setQuoteError] = useState<boolean>(false)
  const [addressValided, setAddressValided] = useState<boolean>(false)

  const { setError } = useError()

  const initials =
    (location.state && {
      firstName: (location.state as any).firstName,
      lastName: (location.state as any).lastName,
      address: (location.state as any).address,
      unitNumber: (location.state as any).unitNumber,
    }) ||
    {}

  const schema = useMemo(
    () =>
      Yup.object<UserAddressInput>().shape({
        firstName: Yup.string()
          .label('First Name')
          .required(messages.Common.Errors.RequiredFirstName),
        lastName: Yup.string()
          .label('Last Name')
          .required(messages.Common.Errors.RequiredLastName),
        address: Yup.object<TAddressObject>()
          .shape({
            status: Yup.number()
              .test(
                'addressValidation',
                messages.Common.Errors.RequiredAddress,
                (v: EAddressObjectStatus) => v !== EAddressObjectStatus.addressRequired,
              )
              .test(
                'invalidAddress',
                messages.Common.Errors.InvalidAddress,
                (v: EAddressObjectStatus) => v !== EAddressObjectStatus.invalidAddress,
              )
              .test(
                'unitNumberRequired',
                messages.Common.Errors.RequiredUnitNumber,
                (v: EAddressObjectStatus) =>
                  v !== EAddressObjectStatus.unitNumberRequired,
              )
              .test(
                'invalidUnitNumber',
                messages.Common.Errors.InvalidUnitNumber,
                (v: EAddressObjectStatus) => v !== EAddressObjectStatus.invalidUnitNumber,
              ),
          })
          .label('Address'),
      }),
    [messages],
  )

  const formik = useFormik<UserAddressInput>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      firstName: initials.firstName || '',
      lastName: initials.lastName || '',
      address: {
        address: initials.address || '',
        unitNumber: initials.unitNumber || '',
        requiredUnitNumber: !!initials.unitNumber,
        status: initials.address
          ? EAddressObjectStatus.success
          : EAddressObjectStatus.addressRequired,
      },
    },
    onSubmit: (value) => {
      
      setLoading(true)

      placeAPI
        .checkAddress(value.address.address, value.address.unitNumber)
        .then(() => {
          return generateQuote({
            firstName: value.firstName,
            lastName: value.lastName,
            address: value.address,
          })
            .then((res) => {
              router.push(`/quote/${res.DTOApplication[0].ApplicationNumber}/customize`)
            })
            .catch((e) => {
              // AS IS: 
              //if (isAKnownError(e)) {
              setError(e)
              //} else {
              //setQuoteError(true)
              //}
            })
        })
        .catch((err) => {
          if (isAKnownError(err)) {
            setError(err)
          } else {
            formik.setFieldValue('address', {
              ...value.address,
              status: err,
              requiredUnitNumber:
                err === EAddressObjectStatus.unitNumberRequired ||
                value.address.requiredUnitNumber,
            })
          }
        })
        .finally(() => isMountedRef.current && setLoading(false))
      //setAddressValided(true)
    },
  })

  const schemaProductSelect = useMemo(
    () =>
      Yup.object<any>().shape({
        SELECTED_PRODUCT: Yup.string()
          .required('You have to select a product')
      }),
    [messages],
  )

  const formikProductSelect = useFormik<any>({
    validationSchema: schemaProductSelect,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {},
    onSubmit: (value) => {
      if (value.SELECTED_PRODUCT === 'AUTO') {
        setLoading(true)

        placeAPI
          .checkAddress(formik.values.address.address, formik.values.address.unitNumber)
          .then(() => {
            return generateQuote({
              firstName: formik.values.firstName,
              lastName: formik.values.lastName,
              address: formik.values.address,
            })
              .then((res) => {
                router.push(`/quote/${res.DTOApplication[0].ApplicationNumber}/customize`)
              })
              .catch((e) => {
                if (isAKnownError(e)) {
                  //setError(e)
                } else {
                  setQuoteError(true)
                }
              })
          })
          .catch((err) => {
            if (isAKnownError(err)) {
                  //setError(e)
            } else {
              formik.setFieldValue('address', {
                ...formik.values.address,
                status: err,
                requiredUnitNumber:
                  err === EAddressObjectStatus.unitNumberRequired ||
                  formik.values.address.requiredUnitNumber,
              })
            }
          })
          .finally(() => isMountedRef.current && setLoading(false))
      } else {
        alert('Still not available')
      }
    },
  })

  useEffect(() => {
    isMountedRef.current = true
      ; (window as any).ga && (window as any).ga('send', 'Quote Page View')

    if (Object.keys(initials).length > 0) {
      formik.submitForm()
    }
    return () => (isMountedRef.current = false)
  }, [])

  useEffect(() => {
    // change error messages when the locale is changed
    isMountedRef.current &&
      Object.keys(formik.touched)
        .filter((field) => formik.touched[field] === true)
        .forEach((field) => formik.setFieldTouched(field))
  }, [locale])

  if (hasQuoteError) {
    return <QuoteErrorModal isOpen={true} address={formik.values.address} firstName={formik.values.firstName} lastName={formik.values.lastName} 
    onCloseModal={() => setQuoteError(false)} 
    />
  }

  return (
    //!addressValided ?
      <Screen title={messages.MainTitle} loading={isLoading}>
        <div css={[styles.background]}>
          <img src='~/assets/images/home-background.png' css={[styles.image]} />
        </div>
        <Container css={styles.container}>
          <Heading css={[utils.mb(6)]}>{messages.Main.Heading}</Heading>

          <FormikProvider value={formik}>
            <form
              data-testid="address-form"
              css={styles.form}
              onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
              }}
            >
              <FormikInput
                data-testid="input-firstname"
                name="firstName"
                css={[utils.mb(3), styles.nameInput]}
                placeholder={messages.Common.FirstName}
              />
              <FormikInput
                data-testid="input-lastname"
                name="lastName"
                css={[utils.mb(3), styles.nameInput]}
                placeholder={messages.Common.LastName}
              />
              <FormikAddressInput
                data-testid="input-address"
                name="address"
                placeholder={messages.Main.AddressPlaceholder}
                onChange={(address, addressSelected) => {
                  formik.handleChange({
                    target: {
                      name: 'address',
                      value: address,
                    },
                  })

                  formik.setFieldTouched('address')

                  if (addressSelected) {
                    formik.handleSubmit()
                  }
                }}
                onClearAddress={() => {
                  formik.handleChange({
                    target: {
                      name: 'address',
                      value: {
                        address: '',
                        unitNumber: '',
                        status: EAddressObjectStatus.success,
                        unitNumberRequired: false,
                      },
                    },
                  })
                }}
                css={[utils.flex(1), utils.mb(3)]}
              />
              <Button data-testid="button-submit" type="submit" css={styles.quoteBtn}>
                {messages.Main.GetQuote}
              </Button>
            </form>
          </FormikProvider>
        </Container>
      </Screen>
      /*:
      <Screen title={messages.Main.title} loading={isLoading}>
        <Container css={[styles.container, styles.containerProductSlect]}>
          <FormikProvider value={formikProductSelect}>
            <form
              data-testid="product-select-form"
              css={styles.formProductSelect}
              onSubmit={(e) => {
                e.preventDefault()
                formikProductSelect.handleSubmit()
              }}
            >
              <div
                css={[
                  utils.centerAlign,
                  utils.fullWidth,
                  utils.position('relative'),
                ]}
              >
                <FormGroup label='Select your product' size={'1.8em'} bold css={styles.formGroup}>
                  <FormikImagesSwitch
                    name="SELECTED_PRODUCT"
                    css={[utils.fullWidth, utils.mb(3)]}
                    options={[
                      {
                        label: 'HOME ONLY',
                        value: 'HOME',
                        //icon: faHome,
                        url: 'home_circle_icon.png'
                      },
                      {
                        label: 'HOME & AUTO',
                        value: 'HOME_AUTO',
                        //icon: faQuestion
                        url:'car_and_home_icon.png'
                      },
                      {
                        label: 'AUTO ONLY',
                        value: 'AUTO',
                        //icon: faCar
                        url: 'car_circle_icon.png'
                      },
                      {
                        label: 'LANDLORD',
                        value: 'LANDLORD',
                        //icon: faKey
                        url: 'landlord_circle_icon.png'
                      },
                    ]}
                    onChange={(e) => {
                      formikProductSelect.handleChange({
                        target: {
                          name: 'SELECTED_PRODUCT',
                          value: e,
                        },
                      })
                    }}
                  />
                </FormGroup>

              </div>

              <div
                css={[
                  utils.centerAlign,
                  utils.fullWidth,
                  utils.position('relative'),
                  utils.mt(4),
                ]}
              >
                <Button disabled={!formikProductSelect.values.SELECTED_PRODUCT} type="submit">{'Continue'}</Button>
              </div>
            </form>
          </FormikProvider>
        </Container>
      </Screen>*/

  )
}
