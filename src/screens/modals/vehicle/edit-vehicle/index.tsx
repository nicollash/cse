
import { jsx } from '@emotion/react'
import { FunctionComponent, useEffect, useState } from 'react'
import { useFormik, FormikProvider } from 'formik'

import {
  Modal,
  FormGroup,
  FormikInput,
  FormikSelect,
  FormikDatePicker,
  Button,
  DeleteButton,
  Hr,
  Text,
  FormikSwitch,
  FormikSpinner,
  Row,
  Col,
} from '~/components'
import { useLocale, useQuote } from '~/hooks'
import { utils } from '~/styles'
import { VehicleInfo } from '~/types'
import { VehicleOptions } from '~/options'

import { styles } from './styles'
import { questions } from '~/utils/configuration/questions'
import { UWQuestionsNoForm } from '~/screens/pages/customize/components/uw-questions-noform'
import { getRiskByVIN } from '~/services'

interface Props {
  isOpen: boolean
  defaultValue: VehicleInfo
  onDeleteVehicle?: () => any
  onUpdate?: (value: VehicleInfo) => any
  onCloseModal?: () => any
}

export const EditVehicleModal: FunctionComponent<Props> = ({
  isOpen,
  defaultValue,
  onCloseModal,
  onUpdate,
  onDeleteVehicle,
  ...props
}) => {
  const { messages } = useLocale()
  const { quoteDetail } = useQuote()
  const [actualVIN, setActualVIN] = useState(null)
  const [vinChanged, setVinChanged] = useState(false)
  const [vinRequestError, setVINRequestError] = useState(false)



  const customValidate = (values: VehicleInfo) => {
    let errors: any = {};

    if (values.symbolCode == 'ZZXXXX'
      || ((values.symbolCode == '' || !values?.symbolCode)
        && (values.comprehensive != 'None' || values.collisionDeductible != 'None'))) {

      //Required
      if (!values.costNew) { //Add condition you want
        errors.costNew = "Cost new is required";
      }
    }

    return errors;
  }

  const formik = useFormik<VehicleInfo>({
    validate: customValidate,
    //validationSchema: null,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      ...defaultValue,
      annualMileage: defaultValue?.annualMileage ? defaultValue.annualMileage : 'Unverified',
      estimateAnnualMiles: defaultValue?.estimateAnnualMiles && (defaultValue?.estimateAnnualMiles != '0') ? defaultValue.estimateAnnualMiles : '13000',
      verifiedMileageOverride: defaultValue?.verifiedMileageOverride ? defaultValue.verifiedMileageOverride : 'No',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      onUpdate(value)
      onCloseModal()
    },
  })

  useEffect(() => {
    if (isOpen) {
      setActualVIN(defaultValue.vinNumber)
      setVinChanged(false)
        ; (window as any).ga && (window as any).ga('send', 'Car Modal View')
    }
  }, [isOpen])

  useEffect(() => {
    if (formik.values.vinNumber && formik.values.vinNumber.trim() != "" && formik.values.vinNumber != actualVIN) {
      setVinChanged(true)
      getRiskByVIN(formik.values.vinNumber.trim()).then((res) => {
        formik.handleChange({
          target: {
            name: 'year',
            value: res.DTORisk[0].DTOVehicle[0].ModelYr,
          },
        })

        formik.handleChange({
          target: {
            name: 'make',
            value: res.DTORisk[0].DTOVehicle[0].Manufacturer,
          },
        })

        formik.handleChange({
          target: {
            name: 'model',
            value: res.DTORisk[0].DTOVehicle[0].Model,
          },
        })
      }).catch(() => {
        setVINRequestError(true)
      }).finally(() => setVinChanged(false))      
      setActualVIN(formik.values.vinNumber.trim())
      //setVinChanged(true)
    } else {
      setVinChanged(false)
      setVINRequestError(false)
    }    
  }, [formik.values.vinNumber])

  if (!formik.values) {
    return <div></div>
  }

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={defaultValue?.id ? messages.CarModal.EditCar : messages.CarModal.AddCar}
      onCloseModal={onCloseModal}
      width="1100px"
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit()
          }}
          css={styles.form}
        >
          <div css={styles.row}>
            <FormGroup label={messages.CarModal.CarVinNumber} css={styles.formGroup}>
              <Row>
                <Col md={11} lg={11}>
                  <FormikInput
                    name="vinNumber"
                    css={[utils.mb(3)]}
                    onChange={(e) => {
                      formik.handleChange({
                        target: {
                          name: 'vinNumber',
                          value: e.target.value.trim(),
                        },
                      })
                    }
                    }
                  />
                </Col>
                {}
              </Row>

              {}
              {
                vinRequestError &&
                <Row>
                  <Text css={utils.pl(5)} color='red'>{`Invalid VIN number`}</Text>
                </Row>}
            </FormGroup>
            <FormGroup css={[styles.formGroup, utils.pa(3), styles.carInfo]}>
              <div css={[utils.display('flex')]}>
                <div css={[utils.display('inline-flex'), utils.mr(3)]}>
                  <Text nowrap bold>
                    {messages.CarModal.ModelYear}:&nbsp;
                  </Text>
                  <Text nowrap>{formik.values.year}</Text>
                </div>
                <div css={[utils.display('inline-flex'), utils.mr(3)]}>
                  <Text nowrap bold>
                    {messages.CarModal.Make}:&nbsp;
                  </Text>
                  <Text nowrap>{formik.values.make}</Text>
                </div>
                <div css={[utils.display('inline-flex')]}>
                  <Text nowrap bold>
                    {messages.CarModal.Model}:&nbsp;
                  </Text>
                  <Text nowrap>{formik.values.model}</Text>
                </div>
              </div>
            </FormGroup>
          </div>

          <Hr />

          <div css={styles.row}>
            <FormGroup
              label={messages.CarModal.Condition}
              css={[styles.formGroup, utils.flex(1)]}
            >
              <FormikSwitch
                name="condition"
                css={[utils.mb(3), utils.fullWidth]}
                options={VehicleOptions.Condition.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(e) =>
                  formik.handleChange({
                    target: {
                      name: 'condition',
                      value: e,
                    },
                  })
                }
              />
            </FormGroup>
            <FormGroup
              label={messages.CarModal.LeasedOrPurchased}
              description={messages.CarModal.LeasedOrPurchasedDescription}
              css={[styles.formGroup, utils.flex(2)]}
            >
              <FormikSwitch
                name="leasedOrPurchased"
                css={[utils.mb(3), utils.fullWidth, utils.flex(1)]}
                options={VehicleOptions.LeasedOrPurchased.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(e) =>
                  formik.handleChange({
                    target: {
                      name: 'leasedOrPurchased',
                      value: e,
                    },
                  })
                }
              />
            </FormGroup>
            <FormGroup
              label={messages.CarModal.PurchaseDate}
              description={messages.CarModal.PurchaseDateDescription}
              css={[styles.formGroup, utils.flex(1)]}
            >
              <FormikDatePicker
                name="purchaseDate"
                css={[utils.mb(3), utils.fullWidth]}
                maxDate={new Date()}
                onChange={(e) =>
                  formik.handleChange({
                    target: {
                      name: 'purchaseDate',
                      value: e,
                    },
                  })
                }
              />
            </FormGroup>
            <FormGroup
              label={messages.CarModal.PrimaryDriver}
              description={messages.CarModal.PrimaryDriverDescription}
              css={[styles.formGroup, utils.flex(1)]}
            >
              <FormikSelect
                name="primaryDriver"
                css={[utils.mb(3), utils.fullWidth]}
                options={
                  quoteDetail.drivers
                    .filter((dr) => dr.status === 'Active')
                    .map((driver) => ({
                      label: `${driver.firstName} ${driver.lastName}`,
                      value: driver.id,
                    }))}
                onChange={(e) =>
                  formik.handleChange({
                    target: {
                      name: 'primaryDriver',
                      value: e.value,
                    },
                  })
                }
              />
            </FormGroup>
            <FormGroup
              label={messages.CarModal.PrimaryUse}
              description={messages.CarModal.PrimaryUseDescription}
              css={[styles.formGroup, utils.flex(2)]}
            >
              <FormikSwitch
                name="primaryUse"
                css={[utils.mb(3), utils.fullWidth]}
                options={VehicleOptions.PrimaryUse}
                onChange={(e) =>
                  formik.handleChange({
                    target: {
                      name: 'primaryUse',
                      value: e,
                    },
                  })
                }
              />
            </FormGroup>

            {formik.values.primaryUse === 'Business' ||
              formik.values.primaryUse === 'Work' ? (
              <FormGroup
                label={messages.CarModal.MilesDriven}
                description={messages.CarModal.MilesDrivenDescription}
                css={[styles.formGroup, utils.flex(1)]}
              >
                <FormikSpinner
                  name="milesDriven"
                  min={0}
                  css={[utils.mb(3), utils.fullWidth]}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: 'milesDriven',
                        value: e,
                      },
                    })
                  }}
                />
              </FormGroup>
            ) : (
              <FormGroup css={[styles.formGroup, utils.flex(1)]} />
            )}

            {formik.values.symbolCode == 'ZZXXXX' || ((formik.values.symbolCode == '' || !formik.values?.symbolCode) && (formik.values.comprehensive != 'None' || formik.values.collisionDeductible != 'None')) ? (
              <FormGroup
                label={messages.CarModal.CostNew}
                description={messages.CarModal.CostNewDescription}
                css={[styles.formGroup, utils.flex(1)]}
              >
                <FormikSpinner
                  name="costNew"
                  //min={1}
                  step={500}
                  css={[utils.mb(3), utils.fullWidth]}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: 'costNew',
                        value: e,
                      },
                    })
                  }}
                />
              </FormGroup>
            ) : (
              <FormGroup css={[styles.formGroup, utils.flex(1)]} />
            )}

            <FormGroup css={[styles.formGroup, utils.flex(1)]} />
            <FormGroup css={[styles.formGroup, utils.flex(1)]} />
          </div>

          <Hr />

          <div css={styles.row}>
            <FormGroup
              label={messages.Common.OdometerReading}
              css={[styles.formGroup, utils.flex(1)]}
            >
              <FormikSpinner
                name="odometerReading"
                min={0}
                step={500}
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'odometerReading',
                      value: e,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup
              label={messages.RequiredInformation.ReadingDate}
              css={[styles.formGroup, utils.flex(1)]}
            >
              <FormikDatePicker
                name="readingDate"
                css={[utils.mb(3), utils.fullWidth]}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'readingDate',
                      value: e,
                    },
                  })
                }}
              />
            </FormGroup>
            <FormGroup css={[styles.formGroup, utils.flex(1)]} />
          </div>
          <Hr />

          <div css={styles.row}>
            <FormGroup
              label={messages.CarModal.AnnualMileage}
              description={messages.CarModal.AnnualMileageDescription}
              css={[styles.formGroup, utils.flex(1)]}
            >
              <FormikSwitch
                name="annualMileage"
                css={[utils.mb(3), utils.fullWidth]}
                options={VehicleOptions.AnnualMileage.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'annualMileage',
                      value: e,
                    },
                  })

                  if (formik.values.recommendedMileage && (e == 'Verified')) {
                    if (formik.values.recommendedMileage != '0') {
                      formik.handleChange({
                        target: {
                          name: 'estimateAnnualMiles',
                          value: formik.values.recommendedMileage,
                        },
                      })
                    }

                    formik.handleChange({
                      target: {
                        name: 'verifiedMileageOverride',
                        value: 'No',
                      },
                    })
                  }
                }}
              />
            </FormGroup>
            <FormGroup
              label={messages.CarModal.EstimateAnnualMiles}
              description={messages.CarModal.EstimateAnnualMilesDescription}
              css={[styles.formGroup, utils.flex(2)]}
            >
              <FormikSpinner
                name="estimateAnnualMiles"
                step={1000}
                min={0}
                css={[utils.mb(3), utils.fullWidth]}
                helperText={messages.CarModal.RecommendedMileage(
                  formik.values.recommendedMileage || '',
                )}
                onChange={(e) => {
                  formik.handleChange({
                    target: {
                      name: 'estimateAnnualMiles',
                      value: e,
                    },
                  })

                  if (formik.values.annualMileage == 'Verified' && (formik.values.recommendedMileage != e.toString())) {
                    formik.handleChange({
                      target: {
                        name: 'verifiedMileageOverride',
                        value: 'Yes',
                      },
                    })
                  }

                  if (formik.values.annualMileage == 'Verified' && (formik.values.recommendedMileage == e.toString())) {
                    formik.handleChange({
                      target: {
                        name: 'verifiedMileageOverride',
                        value: 'No',
                      },
                    })
                  }
                }}
              />
            </FormGroup>

            <FormGroup css={[styles.formGroup, utils.flex(1)]} />
          </div>

          <Hr />

          <div css={styles.row}>
            <FormGroup
              label={`${messages.CarModal.GarazingZip} ${quoteDetail.insuredAddress.PostalCode}`}
              css={[styles.formGroup, utils.flex(2)]}
            >
              <div css={utils.display('flex')}>
                <FormikSwitch
                  name="differentGaragingZip"
                  css={[utils.mb(3), utils.flex(2)]}
                  options={[
                    {
                      label: messages.Common.Yes,
                      value: true,
                    },
                    {
                      label: messages.Common.No,
                      value: false,
                    },
                  ]}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: 'differentGaragingZip',
                        value: e,
                      },
                    })
                  }}
                />

                {!formik.values.differentGaragingZip ? (
                  <FormikInput
                    name="garagingZip"
                    css={[utils.mb(3), utils.ml('16px'), utils.flex(1)]}
                    placeholder={messages.CarModal.ZipCode}
                    onChange={(e) => {
                      formik.handleChange(e)
                    }}
                  />
                ) : (
                  <div css={[utils.mb(3), utils.ml('45px'), utils.flex(1)]} />
                )}
              </div>
            </FormGroup>

            <FormGroup css={[styles.formGroup, utils.flex(3)]} />
          </div>

          <Hr />
          <div css={[utils.mb(0), utils.mt("2rem")]}>
            <UWQuestionsNoForm
              title={'Vehicle Questions'}
              configQuestions={questions.autoIndividuals}
              questions={formik.values.questions}
              formik={formik}
              onAnswerChange={(questionName, answer) => {
              }}
            />
          </div>
          <Hr />

          <div
            css={[
              utils.centerAlign,
              utils.fullWidth,
              utils.position('relative'),
              utils.mt(4),
            ]}
          >
            {defaultValue?.id && (
              <DeleteButton
                css={styles.deleteButton}
                onClick={() => {
                  onDeleteVehicle()
                  onCloseModal()
                }}
              >
                {messages.CarModal.DeleteCar}
              </DeleteButton>
            )}
            <Button
              type="button"
              buttonType="secondary"
              css={utils.mr(5)}
              onClick={onCloseModal}
            >
              {messages.Common.Cancel}
            </Button>
            <Button disabled={vinChanged || vinRequestError} type="submit">{messages.Common.Save}</Button>
          </div>
        </form>
      </FormikProvider>
    </Modal>
  )
}
