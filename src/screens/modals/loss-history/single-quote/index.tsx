

import { jsx } from '@emotion/react'
import { FunctionComponent, useEffect, useState } from 'react'
import { Button, Col, FormGroup, FormikDatePicker, FormikInput, FormikSelect, Modal, Row } from '~/components'
import { useLocale, useQuote } from '~/hooks'

import { styles } from './../styles'
import { theme, utils } from '~/styles'
import { LossHistoryInfo, } from '~/types'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { Text } from '~/components'

import './../styles.css'
import { FormikTextArea } from '~/components/text-area'
import { lhConfig } from '~/utils/configuration/lossHistory'
import { AddLossHistoryItem } from '~/screens/pages/customize/components/add-lossHistory-item'
import { useRouter } from 'next/router'

interface Props {
    isOpen: boolean
    lossHistory: Array<LossHistoryInfo>
    onUpdate?: (updatedItem: Array<LossHistoryInfo>) => any
    onCloseModal?: () => any
    onAppCloseOut?: (updatedItem: Array<LossHistoryInfo>) => any
}

export const LossHistoryModal: FunctionComponent<Props> = ({
    isOpen,
    lossHistory,
    onUpdate,
    onCloseModal,
    onAppCloseOut,
    ...props
}) => {
    const { locale, messages } = useLocale()
    const [addingItem, setAddintItem] = useState<boolean>(false)
    const [deletingItem, setDeletingItem] = useState<number>(null)
    const [editingItem, setEditingItem] = useState<LossHistoryInfo>(null)
    const router = useRouter()

    const {
        quoteDetail,
    } = useQuote()

    useEffect(() => {
        if (deletingItem != null) {
            //lossHistory[deletingItem].status = 'Deleted'
            //onUpdate(additionalInterest);
        }
    }, [deletingItem])

    useEffect(() => {
        if (editingItem != null) {
            let position = lossHistory.findIndex((el) => el.id === editingItem.id)
            lossHistory[position] = editingItem
            onUpdate(lossHistory);
        }
    }, [editingItem])

    /*useEffect(() => {                   
        if(isOpen && !quoteDetail.planDetails.isQuote){
            onAppCloseOut(lossHistory)
        }
    }, [isOpen])*/

    const schema = () => Yup.object<LossHistoryInfo>().shape({
        LossDt: Yup.string().required(messages.LossHistoryModal.Errors.LossDt),
        LossCauseCd: Yup.string().required(messages.LossHistoryModal.Errors.LossCauseCd),
        DriverName: Yup.string().required(messages.LossHistoryModal.Errors.DriverName),
        AtFaultCd: Yup.string().required(messages.LossHistoryModal.Errors.AtFaultCd),
    })

    const formik = useFormik<LossHistoryInfo>({
        validationSchema: schema,
        enableReinitialize: true,
        validateOnMount: true,
        validateOnChange: true,
        validateOnBlur: true,
        initialValues: {
            //id: 'LH-' + lossHistory.length + 1,
            LossHistoryNumber: (lossHistory.length + 1).toString(),
            //LossDt: new Date(),
            LossCauseCd: '',
            DriverName: '',
            AtFaultCd: ''
        },
        onSubmit: (value) => {
            lossrouter.push(value);
            setAddintItem(false)
            onUpdate(lossHistory)
        },
    })

    return (
        <Modal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={true}
            title={messages.LossHistoryModal.Title}
            onCloseModal={onCloseModal}
            width='950px'
        >
            <div css={[styles.row, styles.addSection]}>
                {addingItem ?
                    ''
                    :
                    <div css={[styles.icon]} onClick={() => {
                        setAddintItem(true)
                    }}>
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </div>
                }
            </div>
            <div css={styles.aiInformation}>
                {/* ADD ITEM SECTION*/}

                {addingItem ?
                    <div css={[utils.fullWidth, styles.addContainer]}>

                        <FormikProvider value={formik}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    formik.handleSubmit()
                                }}
                                css={[styles.form.map, utils.pl(1)]}
                                {...props}
                            >

                                <div css={[styles.row]}>
                                    <div css={[styles.linearLines, styles.cancelBottomContainer]}>
                                        <div css={[styles.icon]} onClick={() => {
                                            setAddintItem(false)
                                        }}>
                                            <FontAwesomeIcon className='cancelBottom' icon={faTimesCircle} />
                                        </div>
                                    </div>
                                </div>
                                <Row css={utils.mb(1)}>
                                    <Col md={12} lg={12}>
                                        {`Number ${formik.values.LossHistoryNumber}`}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} lg={6}>
                                        <FormGroup key='fg-LossDt' label={messages.LossHistoryModal.AddNewSection.LossDate} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            {<FormikDatePicker
                                                name="LossDt"
                                                css={[utils.mb(3), utils.fullWidth]}
                                                maxDate={new Date()}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'LossDt',
                                                            value: e,
                                                        },
                                                    })
                                                }}
                                            />}
                                        </FormGroup>
                                    </Col>

                                    <Col md={12} lg={6}>
                                        <FormGroup key='fg-LossCauseCd' label={messages.LossHistoryModal.AddNewSection.CauseOfLoss} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikSelect
                                                name='LossCauseCd'
                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                placeholder={'Select...'}
                                                options={lhConfig.auto.lossCauses}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'LossCauseCd',
                                                            value: e.value,
                                                        },
                                                    })
                                                }} />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-ClaimNumber' label={messages.LossHistoryModal.AddNewSection.ClaimNumber} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='ClaimNumber'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-ClaimStatusCd' label={messages.LossHistoryModal.AddNewSection.ClaimStatus} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikSelect
                                                name='ClaimStatusCd'
                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                placeholder={'Select...'}
                                                options={[
                                                    { value: 'Open', label: 'Open' },
                                                    { value: 'Closed', label: 'Closed' }
                                                ]}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'ClaimStatusCd',
                                                            value: e.value,
                                                        },
                                                    })
                                                }} />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-CatastropheNumber' label={messages.LossHistoryModal.AddNewSection.CatastropheN} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='CatastropheNumber'
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-CarrierName' label={messages.LossHistoryModal.AddNewSection.CarrierName} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='CarrierName'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-TypeCd' label={messages.LossHistoryModal.AddNewSection.PolicyType} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikSelect
                                                name='TypeCd'
                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                placeholder={'Select...'}
                                                options={lhConfig.auto.typeCdOptions}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'TypeCd',
                                                            value: e.value,
                                                        },
                                                    })
                                                }} />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-PolicyNumber' label={messages.LossHistoryModal.AddNewSection.PolicyNumber} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='PolicyNumber'
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-LossAmt' label={messages.LossHistoryModal.AddNewSection.LossAmount} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='LossAmt'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-PaidAmt' label={messages.LossHistoryModal.AddNewSection.PaidAmount} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='PaidAmt'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-VehIdentificationNumber' label={messages.LossHistoryModal.AddNewSection.VehicleVIN} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='VehIdentificationNumber'
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row css={utils.mt(1)}>
                                    <Col md={12} lg={12}>
                                        <FormGroup key='fg-AtFaultCd' label={messages.LossHistoryModal.AddNewSection.AtFault} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikSelect
                                                name='AtFaultCd'
                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                placeholder={'Select...'}
                                                options={lhConfig.auto.atFaultCdOptions}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'AtFaultCd',
                                                            value: e.value,
                                                        },
                                                    })
                                                }} />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-DriverName' label={messages.LossHistoryModal.AddNewSection.DriverName} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikSelect
                                                name='DriverName'
                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                placeholder={'Select...'}
                                                options={[
                                                    ...quoteDetail.drivers.map((driver) => ({
                                                        label: `${driver.lastName}, ${driver.firstName}`,
                                                        value: `${driver.lastName}, ${driver.firstName}`,
                                                    })),
                                                    ...lhConfig.auto.driverNameOptions,
                                                ]}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'DriverName',
                                                            value: e.value,
                                                        },
                                                    })
                                                }} />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-DriverLicensedStateProvCd' label={messages.LossHistoryModal.AddNewSection.LicenseState} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikSelect
                                                name='DriverLicensedStateProvCd'
                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                placeholder={'Select...'}
                                                options={lhConfig.auto.states}
                                                onChange={(e) => {
                                                    formik.handleChange({
                                                        target: {
                                                            name: 'DriverLicensedStateProvCd',
                                                            value: e.value,
                                                        },
                                                    })
                                                }} />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12} lg={4}>
                                        <FormGroup key='fg-DriverLicenseNumber' label={messages.LossHistoryModal.AddNewSection.LicenseNumber} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='DriverLicenseNumber'
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} lg={12}>
                                        <FormGroup key='fg-Comment' label={messages.LossHistoryModal.AddNewSection.Comments}
                                            css={[styles.linearLines, styles.interestNameContainer]}
                                            textContainerClassName='linearLabelWithValidationTextArea'
                                            containerClassName='customNameContainer'>
                                            <FormikTextArea
                                                css={[utils.mb(3), styles.interestNameArea]}
                                                name='Comment' />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} lg={12} >
                                        <FormGroup key='fg-LossDesc' label={messages.LossHistoryModal.AddNewSection.LossDescription}
                                            css={[styles.linearLines, styles.interestNameContainer]}
                                            textContainerClassName='linearLabelWithValidationTextArea'
                                            containerClassName='customNameContainer'>
                                            <FormikTextArea
                                                css={[utils.mb(3), styles.interestNameArea]}
                                                name='LossDesc' />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div css={styles.saveButton}>
                                    <Button type="submit">{messages.LossHistoryModal.AddNewSection.AddItem}</Button>
                                </div>

                            </form>
                        </FormikProvider>

                    </div>
                    : ''}

                {/* ITEMS LIST SECTION */}
                <div css={[utils.fullWidth, styles.itemsContainer]}>
                    <div css={styles.row}>
                        { lossHistory.length ?
                            lossHistory
                                //.filter(i => i.status === 'Active')
                                .sort((a, b) => +b.LossHistoryNumber - +a.LossHistoryNumber)
                                .map((li, index) => (
                                    <AddLossHistoryItem key={`${index}.lhI`} item={li} index={index}
                                        onDelete={() => {
                                            setDeletingItem(index)
                                        }}
                                        onEdit={(updatedItem) => {
                                            setEditingItem(updatedItem)
                                        }}
                                    />
                                ))
                                :
                            <Text
                                width={'100%'}
                                size="15px"
                                color={theme.color.error}
                                textAlign="center"
                                css={[utils.mb(4), utils.borderTop, utils.justifyContent('start')]}
                            >
                                {'Empty list'}
                            </Text>
                                
                        }
                    </div>
                </div>

            </div>

        </Modal >
    )
}
