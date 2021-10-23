
import { jsx } from '@emotion/react'
import { FunctionComponent, useMemo, useState, useEffect, useCallback } from 'react'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import {
  Modal,
  FormGroup,
  FormikInput,
  FormikSelect,
  FormikDatePicker,
  Button,
  DeleteButton,
  Hr,
  FormikSwitch,
  FormikSpinner,
  FormikCheckbox,
  Row,
  Col,
} from '~/components'
import { utils } from '~/styles'
import { DriverInfo, DriverPointsInfo } from '~/types'
import { DriverOptions } from '~/options'

import { styles } from './styles'
import { useLocale, useQuote } from '~/hooks'
import { Text } from '~/components'
import { AddDriverPointsItem } from '~/screens/pages/customize/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { logger } from '~/utils'

interface Props {
  driverIndex:number
  isOpen: boolean
  defaultValue: DriverInfo
  onDeleteDriver?: () => any
  onUpdate?: (v: DriverInfo) => any
  onUpdateDriverPoints?: (action:string, driverNumber:string, dP: DriverPointsInfo) => any
  onCloseModal?: () => any
  onCancel?: () => any
}

export const EditDriverModal: FunctionComponent<Props> = ({
  driverIndex,
  isOpen,
  defaultValue,
  onDeleteDriver,
  onUpdate,
  onUpdateDriverPoints,
  onCloseModal,
  onCancel,
  ...props
}) => {
  const { locale, messages } = useLocale()
  const [addingItem, setAddingItem] = useState<boolean>(false)
  const [infractionListInfo, setInfractionListInfo] = useState<any>({ TypeCdList: [], InfractionCdList: [] })
  const {
    getInfractionList,
  } = useQuote()

  const schema = useMemo(
    () =>
      Yup.object().shape({
        firstName: Yup.string()
          .label(messages.DriverModal.FirstName)
          .required(messages.DriverModal.Errors.RequiredFirstName),
        lastName: Yup.string()
          .label(messages.DriverModal.LastName)
          .required(messages.DriverModal.Errors.RequiredLastName),
        birthDate: Yup.string()
          .nullable()
          .label(messages.DriverModal.BirthDate)
          .required(messages.DriverModal.Errors.RequiredBirthDate),
        licenseState: Yup.string()
          .label(messages.DriverModal.LicenseState)
          .required(messages.DriverModal.Errors.RequiredLicenseState),
        licenseNumber: Yup.string()
          .label(messages.DriverModal.LicenseNumber)
          .required(messages.DriverModal.Errors.LicenseNumber),
        driverPoints: Yup.array()
          .of(
            Yup.object().shape({
              typeCd: Yup.string().required('Type is required'),
              convictionDt: Yup.string().nullable().required('Conviction Date is required'),
              infractionDt: Yup.string().nullable().required('Infraction Date is required'),
              comments: Yup.string().notRequired()
            })
          )
      }),
    [locale],
  )

  const formik = useFormik<DriverInfo>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    initialValues: defaultValue,
    onSubmit: (value) => {
      onUpdate(value)
      setAddingItem(false)
    },
  })

  const handleGetInfractionList = useCallback(async () => {
    try {
      const infractionList = await getInfractionList()
      logger('----------- Infraction list -------------')
      logger(infractionList)
      const typeCdOptions = infractionList.options[0].option.map(type => ({label: type.name, value: type.value}))
      const infractionOptions = infractionList.options[1].option.map(infraction => ({label: infraction.name, value: infraction.value}))
      setInfractionListInfo({ TypeCdList: typeCdOptions, InfractionCdList: infractionOptions })
    } catch (e) {
      logger('----------- ERROR Infraction list -------------')
      logger(e)
    }
  }, [])

  useEffect(() => {    
    if (isOpen) {
      setAddingItem(false)
        ; (window as any).ga && (window as any).ga('send', 'Driver Modal View')
    }
  }, [isOpen])

  useEffect(() => {
    handleGetInfractionList()
  }, [])

  if (!formik.values) {
    return <div></div>
  }

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={
        defaultValue?.id
          ? messages.DriverModal.EditDriver
          : messages.DriverModal.AddDriver
      }
      onCloseModal={() => {
        onCancel()
      }}
      width="1100px"
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit()
          }}
          css={styles.form}
          {...props}
        >
          <div css={styles.row}>
            <FormGroup label={messages.DriverModal.FirstName} css={styles.formGroup}>
              <FormikInput
                name="firstName"
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => formik.handleChange(e)}
              />
            </FormGroup>
            <FormGroup label={messages.DriverModal.LastName} css={styles.formGroup}>
              <FormikInput
                name="lastName"
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => formik.handleChange(e)}
              />
            </FormGroup>
            <FormGroup
              label={messages.DriverModal.BirthDate}
              description={messages.DriverModal.BirthDateDescription}
              css={styles.formGroup}
            >
              <FormikDatePicker
                name="birthDate"
                dob
                originalDOBValue={formik.values.originalBirthDate}
                css={[utils.mb(3), utils.fullWidth]}
                maxDate={new Date(new Date().getFullYear() - 10, new Date().getMonth())}
                openToDate={new Date(new Date(new Date().getFullYear() - 10, new Date().getMonth()).toLocaleDateString('en-ZA'))}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'birthDate',
                      value: e,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup label={messages.DriverModal.Gender} css={styles.formGroup}>
              <FormikSwitch
                name="gender"
                css={[utils.mb(3), utils.fullWidth]}
                options={DriverOptions.Gender}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'gender',
                      value: e,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup
              label={messages.DriverModal.MaritalStatus}
              description={messages.DriverModal.MaritalStatusDescription}
              css={styles.formGroup}
            >
              <FormikSwitch
                name="maritalStatus"
                css={[utils.mb(3), utils.fullWidth]}
                options={DriverOptions.MaritalStatus.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'maritalStatus',
                      value: e,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup
              label={messages.DriverModal.Occupation}
              description={messages.DriverModal.OccupationDescription}
              css={styles.formGroup}
            >
              <FormikSelect
                name="occupation"
                css={[utils.mb(3), utils.fullWidth]}
                options={DriverOptions.Occupation}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'occupation',
                      value: e.value,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup
              label={messages.DriverModal.LicenseState}
              description={messages.DriverModal.LicenseStateDescription}
              css={styles.formGroup}
            >
              <FormikSelect
                name="licenseState"
                options={DriverOptions.LicenseState}
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'licenseState',
                      value: e.value,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup
              label={messages.DriverModal.LicenseNumber}
              description={messages.DriverModal.LicenseNumberDescription}
              css={styles.formGroup}
            >
              <FormikInput
                name="licenseNumber"
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => formik.handleChange(e)}
              />
            </FormGroup>
            <FormGroup
              label={messages.DriverModal.AgeFirstLicensed}
              description={messages.DriverModal.AgeFirstLicensedLicensed}
              css={styles.formGroup}
            >
              <FormikSpinner
                name="ageFirstLicensed"
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'ageFirstLicensed',
                      value: e,
                    },
                  })
                }}
              />
            </FormGroup>
          </div>




          {defaultValue?.id &&
            <div>
              <Hr />
              <Row>
                <Col md={12} lg={11}>
                  <Text css={utils.fullWidth} bold>{'Violations/Accidents'}</Text>
                </Col>
                <Col md={12} lg={1} css={[utils.justifyContent('flex-end'), utils.display('flex')]}>
                  {!addingItem ?
                    <div css={[styles.icon]} onClick={() => {

                      const tempArray = [...formik.values.driverPoints]
                      tempArray.push({ sourceCd: 'Application', status: 'Active', typeCd: '', convictionDt: null, infractionDt: null })

                      formik.handleChange({
                        target: {
                          name: `driverPoints`,
                          value: tempArray
                        }
                      })

                      setAddingItem(true)
                    }}>
                      <FontAwesomeIcon icon={faPlusCircle} />
                    </div>
                    : ''}
                </Col>
              </Row>
            </div>
          }

          {
          defaultValue?.id &&
            formik.values.driverPoints && formik.values.driverPoints.length ?
            formik.values.driverPoints
              //.reverse()
              //.filter(dP => dP.status === 'Active')
              .map((dP, index) => {
                return dP.status === 'Active' || dP.status === 'New' ?
                  <AddDriverPointsItem key={`${index}.lhI`} item={dP} index={index} formik={formik} options={infractionListInfo}
                    onDelete={() => {
                      formik.handleChange({
                        target: {
                          name: `driverPoints.${index}.status`,
                          value: 'Deleted'
                        }
                      })
                    }}
                    onEdit={() => {
                      setAddingItem(false)                      
                      onUpdateDriverPoints('update', `${driverIndex + 1}`, dP)
                    }}
                    onCancelCreate={() => {
                      setAddingItem(false)
                      formik.values.driverPoints.pop()
                    }}
                    onCreate={() => {
                      setAddingItem(false)                      
                      onUpdateDriverPoints('add', `${driverIndex + 1}`, dP)
                    }}
                  />
                  : ''
              }) : ''
          }

          <Hr />
          <div css={utils.mt(2)}>
            <Text css={utils.fullWidth} bold>{'Discounts'}</Text>

            <Row css={utils.mb(2)}>
              <Col md={12} lg={3.5}>
                <FormikCheckbox
                  key={`check-MatureDriverInd`}
                  name={`matureDriverInd`}
                  label={`Defensive Driver Discount`}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: `matureDriverInd`,
                        value: e,
                      },
                    })
                  }}
                />
              </Col>
              <Col md={12} lg={5}>
                {
                  formik.values.matureDriverInd &&
                  <FormGroup
                    label={'Date Verified'}
                    description={'A Defensive Driver Discount is available to a driver who is at least 55 years of age and has completed California State approved Defensive Driver Improvement Course within the past 3 years of the inception date of the policy.'}
                    css={styles.formGroup}
                  >
                    <FormikDatePicker
                      name={`matureCertificationDt`}
                      css={[utils.mb(3), utils.fullWidth]}
                      maxDate={new Date()}
                      onChange={(e) => {
                        formik.handleChange({
                          target: {
                            name: `matureCertificationDt`,
                            value: e,
                          },
                        })
                      }}
                    />
                  </FormGroup>
                }

              </Col>
            </Row>

            <Row>
              <Col md={12} lg={3.5}>
                <FormikCheckbox
                  key={`check-ScholasticDiscountInd`}
                  name={`scholasticDiscountInd`}
                  label={`Good Student Discount`}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: `scholasticDiscountInd`,
                        value: e,
                      },
                    })
                  }}
                />
              </Col>
              <Col md={12} lg={5}>
                {
                  formik.values.scholasticDiscountInd &&
                  <FormGroup
                    label={'Date Verified'}
                    description={'A Good Student Discount is available to a driver who is a full-time student between 16 and 24 years of age and meets certain scholastic criteria, which are described in the Underwriting Guidelines.'}
                    css={styles.formGroup}
                  >
                    <FormikDatePicker
                      name="scholasticCertificationDt"
                      css={[utils.mb(3), utils.fullWidth]}
                      maxDate={new Date()}
                      onChange={(e) => {
                        formik.handleChange({
                          target: {
                            name: 'scholasticCertificationDt',
                            value: e,
                          },
                        })
                      }}
                    />
                  </FormGroup>
                }
              </Col>
            </Row>
          </div>


          <div
            css={[
              utils.centerAlign,
              utils.fullWidth,
              utils.position('relative'),
              utils.mt(4),
            ]}
          >
            {defaultValue?.id && (
              <DeleteButton css={styles.deleteButton} onClick={() => onDeleteDriver()}>
                {messages.DriverModal.DeleteDriver}
              </DeleteButton>
            )}
            <Button
              buttonType="secondary"
              type="button"
              css={utils.mr(5)}
              onClick={() => {
                onCancel()
              }}
            >
              {messages.Common.Cancel}
            </Button>
            <Button disabled={addingItem} type="submit">{messages.Common.Save}</Button>
          </div>
        </form>
      </FormikProvider>
    </Modal >
  )
}
