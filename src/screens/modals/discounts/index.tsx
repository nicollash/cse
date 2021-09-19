
import { jsx } from '@emotion/react'
import { FunctionComponent, useMemo, useState, useEffect } from 'react'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { Modal, FormGroup, Button, FormikSwitch, Hr, FormikSelect, FormikInput } from '~/components'
import { utils } from '~/styles'
import { BasicPolicyInfo, DiscountInfo, DTOApplication, LineInfo } from '~/types'

import { styles } from './styles'
import { useLocale } from '~/hooks'
import { discountsConfig } from '~/utils/configuration/discounts'

interface Props {
  isOpen: boolean
  lineInfo?: LineInfo
  basicPolicyInfo?: BasicPolicyInfo
  onUpdate?: (updatedLine: LineInfo, updatedBasicPolicy: BasicPolicyInfo) => any
  onCloseModal?: () => any
}

export const DiscountsModal: FunctionComponent<Props> = ({
  isOpen,
  lineInfo,
  basicPolicyInfo,
  onUpdate,
  onCloseModal,
  ...props
}) => {
  const { locale, messages } = useLocale()

  const schema = useMemo(
    () =>
      Yup.object({
        basicPolicy: Yup.object({
          affinityGroupCd: Yup.string().when('programInd', {
            is: 'Affinity Group',
            then: Yup.string().required(messages.DiscountsModal.Errors.RequiredAffinityGroupCd)
          })
        }),
        line: Yup.object({
          relatedPolicyNumber: Yup.string().when('multiPolicyDiscountInd', {
            is: 'No',
            then: Yup.string().notRequired(),
            otherwise: Yup.string().required(messages.DiscountsModal.Errors.RequiredRelatedPolicyNumber)
          }),
          relatedPolicyNumber2: Yup.string().when('multiPolicyDiscount2Ind', {
            is: 'No',
            then: Yup.string().notRequired(),
            otherwise: Yup.string().required(messages.DiscountsModal.Errors.RequiredRelatedPolicyNumber2)
          })
        })
      })
    ,
    [locale],
  )

  const formik = useFormik<{ line: LineInfo, basicPolicy: BasicPolicyInfo}>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      line:lineInfo,
      basicPolicy: basicPolicyInfo
    },
    onSubmit: (value) => {
      onUpdate(value.line, value.basicPolicy)
      onCloseModal()
    },
  })

  useEffect(() => {
    if (isOpen) {
      (window as any).ga && (window as any).ga('send', 'Discounts Modal View')
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      title={messages.Customize.AppliedDiscounts}
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
          {...props}
        >
          <div>
            {
              <div css={styles.row}>
              <FormGroup key={0} label={discountsConfig.auto.multipolicyProperty.description} css={styles.formGroup}>
                <FormikSelect
                  name={'line.multiPolicyDiscountInd'}
                  css={[utils.mb(3), utils.fullWidth]}
                  options={discountsConfig.auto.multipolicyProperty.options}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: 'line.multiPolicyDiscountInd',
                        value: e.value,
                      },
                    })
                    lineInfo.multiPolicyDiscountInd = e.value;
                  }}
                />
                {
                  discountsConfig.auto.multipolicyProperty.needPolicyNumber
                    && lineInfo.multiPolicyDiscountInd != 'No'
                    && lineInfo.multiPolicyDiscountInd != '' ?
                    <FormikInput
                    placeholder='Related Policy Number'
                      name={'line.relatedPolicyNumber'}
                      css={[utils.mb(3), utils.fullWidth]}
                    />
                    : ''
                }
              </FormGroup>  
              <FormGroup key={1} label={discountsConfig.auto.multipolicyUmbrella.description} css={styles.formGroup}>
                <FormikSelect
                  name={'line.multiPolicyDiscount2Ind'}
                  css={[utils.mb(3), utils.fullWidth]}
                  options={discountsConfig.auto.multipolicyUmbrella.options}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: 'line.multiPolicyDiscount2Ind',
                        value: e.value,
                      },
                    })
                    lineInfo.multiPolicyDiscount2Ind = e.value;
                  }}
                />
                {
                  discountsConfig.auto.multipolicyUmbrella.needPolicyNumber
                    && lineInfo.multiPolicyDiscount2Ind != 'No'
                    && lineInfo.multiPolicyDiscount2Ind != '' ?
                    <FormikInput
                      placeholder='Related Policy Number'
                      name={'line.relatedPolicyNumber2'}
                      css={[utils.mb(3), utils.fullWidth]}
                    />
                    : ''
                }
              </FormGroup>  
                <FormGroup key={2} label={discountsConfig.auto.program.description} css={styles.formGroup}>
                  <FormikSelect
                    name={'basicPolicy.programInd'}
                    css={[utils.mb(3), utils.fullWidth]}
                    options={discountsConfig.auto.program.options}
                    onChange={(e) => {
                      formik.handleChange({
                        target: {
                          name: 'basicPolicy.programInd',
                          value: e.value,
                        },
                      })
                      basicPolicyInfo.programInd = e.value;
                    }}
                  />
                  {
                    basicPolicyInfo.programInd == 'Affinity Group' ?
                      <div>
                        <FormikSelect
                          name={'basicPolicy.affinityGroupCd'}
                          placeholder='Select...'
                          css={[utils.mb(3), utils.fullWidth, styles.subSelect]}                          
                          options={discountsConfig.auto.program.affinityGroup.options}
                          onChange={(e) => {
                            formik.handleChange({
                              target: {
                                name: 'basicPolicy.affinityGroupCd',
                                value: e.value,
                              },
                            })
                            basicPolicyInfo.affinityGroupCd = e.value;
                          }}
                        />                        
                      </div>
                      : ''
                  }
                </FormGroup>
              </div>
            }
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
            <Button
              type="button"
              buttonType="secondary"
              css={utils.mr(5)}
              onClick={onCloseModal}
            >
              {messages.Common.Cancel}
            </Button>
            <Button>{messages.Common.Save}</Button>
          </div>
        </form>
      </FormikProvider>
    </Modal>
  )
}
