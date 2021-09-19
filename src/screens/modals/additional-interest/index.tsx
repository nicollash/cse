

import { jsx } from '@emotion/react'
import { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { Button, FormGroup, FormikAddressInput, FormikCheckbox, FormikInput, FormikSelect, Hr, Modal } from '~/components'
import { useLocale } from '~/hooks'

import { styles } from './styles'
import { theme, utils } from '~/styles'
import { AdditionalInterestInfo, CarCoverageInfo, VehicleInfo } from '~/types'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'

import { AddInterestItem } from '~/screens/pages/customize/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { Text } from '~/components'

import './styles.css'
import { aiConfig } from '~/utils/configuration/additionalInterest'
import { FormikTextArea } from '~/components/text-area'

interface Props {
    isOpen: boolean
    additionalInterest: Array<AdditionalInterestInfo>
    vehicles: Array<CarCoverageInfo>
    onUpdate?: (updatedItem: Array<AdditionalInterestInfo>) => any
    onCloseModal?: () => any
}

export const AdditionalInterestModal: FunctionComponent<Props> = ({
    isOpen,
    additionalInterest,
    vehicles,
    onUpdate,
    onCloseModal,
    ...props
}) => {
    const { locale, messages } = useLocale()
    const [addingItem, setAddintItem] = useState<boolean>(false)
    const [deletingItem, setDeletingItem] = useState<number>(null)
    const [editingItem, setEditingItem] = useState<AdditionalInterestInfo>(null)

    useEffect(() => {
        if (deletingItem != null) {
            additionalInterest[deletingItem].status = 'Deleted'
            onUpdate(additionalInterest);
        }
    }, [deletingItem])

    useEffect(() => {
        if (editingItem != null) {
            let position = additionalInterest.findIndex((el) => el.id === editingItem.id)
            additionalInterest[position] = editingItem
            onUpdate(additionalInterest);
        }
    }, [editingItem])

    const schema = () => Yup.object<AdditionalInterestInfo>().shape({
        partyInfo: Yup.object({
            addr: Yup.object({
                //RegionCd: Yup.string().required(messages.AIModal.Errors.RequiredCountry),
                City: Yup.string().when('RegionCd', {
                    is: 'None',
                    then: Yup.string().required(messages.AIModal.Errors.RequiredCity)
                }),
                PostalCode: Yup.string().when('RegionCd', {
                    is: 'None',
                    then: Yup.string().required(messages.AIModal.Errors.RequiredZip)
                        .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, messages.AIModal.Errors.ZipFormat),
                    otherwise: Yup.string().required(messages.AIModal.Errors.RequiredPostalCode)
                        .matches(/(^\d{5}$)|(^\d{5}-\d{4}$)/, messages.AIModal.Errors.ZipFormat)
                }),
                StateProvCd: Yup.string().when('RegionCd', {
                    is: 'None',
                    then: Yup.string().required(messages.AIModal.Errors.StateRequired)
                }),
                Addr1: Yup.string().required(messages.AIModal.Errors.AddressRequired),
                Addr2: Yup.string().when('RegionCd', {
                    is: 'None',
                    then: Yup.string().notRequired(),
                    otherwise: Yup.string().required(messages.AIModal.Errors.AddressLine2Required),
                })
            }),
        }),
        interestName: Yup.string().required(formik.values.interestTypeCd == 'Trust/ee' ? messages.AIModal.Errors.TrustRequired : messages.AIModal.Errors.NameRequired),
        interestTypeCd: Yup.string().required(messages.AIModal.Errors.InterestTypeRequired),
        legalLanguage: Yup.string().when('interestTypeCd', {
            is: 'Trust/ee',
            then: Yup.string().required(messages.AIModal.Errors.LegalLanguageRequired)
        }),
    })

    const formik = useFormik<AdditionalInterestInfo>({
        validationSchema: schema,
        enableReinitialize: true,
        validateOnMount: true,
        validateOnChange: true,
        validateOnBlur: true,
        initialValues: {
            id: 'AI-' + additionalInterest.length + 1,
            accountNumber: '',
            sequenceNumber: (additionalInterest.length + 1).toString(),
            status: 'Active',
            interestName: '',
            interestTypeCd: '',
            partyInfo: {
                addr: {
                    RegionCd: 'None',
                    Addr1: '',
                    Addr2: '',
                    PostalCode: '',
                    StateProvCd: '',
                    City: '',

                }
            },
            preferredDeliveryMethod: 'None',
            linkReference: vehicles.map((vh, index) => ({
                make: vh.make,
                model: vh.model,
                year: vh.year,
                status: false,
                description: `Private Passenger Auto - ${vh.year} ${vh.make} ${vh.model}`,
                id: `LinkReferenceInd_${index}`,
                idRef: vh.parentRiskId,
                modelName: ''
            }))
        },
        onSubmit: (value) => {
            additionalInterest.push(value);
            setAddintItem(false)
            onUpdate(additionalInterest)
        },
    })

    return (
        <Modal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={true}
            title={messages.AIModal.Title}
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
                                css={styles.form}
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


                                    <div css={[styles.row, styles.formGroup, utils.mb(3)]} >
                                        <Text bold={true}>{'Number ' + formik.values.sequenceNumber}</Text>
                                    </div>
                                    
                                    <div css={[styles.linearLines, utils.fullWidth, styles.formPadding]}>
                                        <FormGroup key='ai-interestType' label={messages.AIModal.AddNewSection.InterestType} 
                                            css={[styles.linearLines, utils.mr(2), styles.interestNameContainer]} 
                                            textContainerClassName='linearLabelWithValidationSimple'
                                            containerClassName='customNameContainer'>
                                            <FormikSelect
                                                    name='interestTypeCd'
                                                    css={[utils.mb(3), styles.subSelect, utils.fullWidth, styles.regionCd]}
                                                    //placeholder={messages.AIModal.AddNewSection.CountryPlaceholder}
                                                    options={aiConfig.auto.interestTypes}
                                                    onChange={(e) => {
                                                        formik.handleChange({
                                                            target: {
                                                                name: 'interestTypeCd',
                                                                value: e.value,
                                                            },
                                                        })
                                                    }} />
                                        </FormGroup>
                                        
                                        <FormGroup key='ai-name' label={ formik.values.interestTypeCd == 'Trust/ee' ? messages.AIModal.AddNewSection.TrustLabel : messages.AIModal.AddNewSection.NameLabel} 
                                        css={[utils.mr(2), styles.interestNameContainer]} 
                                        textContainerClassName='linearLabelWithValidationSimple'
                                        containerClassName='customNameContainer'>
                                            <FormikTextArea
                                                css={[utils.mb(3), styles.interestNameArea]}
                                                name='interestName' />
                                        </FormGroup>

                                        <FormGroup key='ai-loanNumber' label={messages.AIModal.AddNewSection.LoanLabel} css={[utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                            <FormikInput
                                                css={utils.mb(3)}
                                                name='accountNumber'
                                            />
                                        </FormGroup>
                                    </div>
                                    
                                    {formik.values.interestTypeCd == 'Trust/ee' ?                
                                        <div css={[utils.fullWidth, styles.formPadding]}>
                                            <FormGroup key='ai-legalLanguage' label={messages.AIModal.AddNewSection.LegalLanguageLabel} css={[utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                    <FormikInput
                                                        css={utils.mb(3)}
                                                        name='legalLanguage'
                                                    />
                                                </FormGroup>
                                        </div>
                                        : ''}

                                    <div css={utils.fullWidth}>
                                        <FormGroup key='ai-address' label={messages.AIModal.AddNewSection.Address.Label} css={[styles.formGroup]}>
                                            <div css={styles.linearLines}>
                                                <FormikSelect
                                                    name='partyInfo.addr.RegionCd'
                                                    css={[utils.mb(3), styles.subSelect, utils.fullWidth, styles.regionCd]}
                                                    placeholder={messages.AIModal.AddNewSection.CountryPlaceholder}
                                                    options={aiConfig.auto.countries}
                                                    onChange={(e) => {
                                                        formik.handleChange({
                                                            target: {
                                                                name: 'partyInfo.addr.RegionCd',
                                                                value: e.value,
                                                            },
                                                        })
                                                    }} />
                                            </div>
                                            <div css={styles.linearLines}>
                                                <div css={styles.addressInputContainer}>
                                                    <FormikInput
                                                        css={[utils.mb(3)]}
                                                        placeholder={messages.AIModal.AddNewSection.Address.AddressPlaceholder}
                                                        name='partyInfo.addr.Addr1'
                                                    />
                                                </div>
                                                {(formik.values.partyInfo.addr.RegionCd != 'None' ) ?
                                                    <div css={styles.addressInputContainer}>
                                                        <FormikInput
                                                            css={[utils.mb(3)]}
                                                            placeholder={messages.AIModal.AddNewSection.Address.Address2Placeholder}
                                                            name='partyInfo.addr.Addr2'
                                                        />
                                                    </div>
                                                    : ''
                                                }
                                            </div>
                                            <div css={styles.linearLines}>
                                                {(formik.values.partyInfo.addr.RegionCd === '' || formik.values.partyInfo.addr.RegionCd === 'None') ?
                                                    <div>
                                                        <div css={[styles.linearLines, styles.cityStateContainer, utils.hideOnMobile]}>
                                                            <FormikInput
                                                                css={[utils.mb(3), styles.city, utils.hideOnMobile]}
                                                                placeholder={messages.AIModal.AddNewSection.Address.CityPlaceholder}
                                                                name='partyInfo.addr.City'
                                                            />
                                                            <FormikSelect
                                                                name='partyInfo.addr.StateProvCd'
                                                                css={[utils.mb(3), styles.subSelect, styles.stateProvCd, utils.hideOnMobile]}
                                                                placeholder={messages.AIModal.AddNewSection.Address.StateProvCdPlaceholder}
                                                                options={aiConfig.auto.states}
                                                                onChange={(e) => {
                                                                    formik.handleChange({
                                                                        target: {
                                                                            name: 'partyInfo.addr.StateProvCd',
                                                                            value: e.value,
                                                                        },
                                                                    })
                                                                }} />
                                                        </div>
                                                        <div css={[styles.linearLines, utils.visibleOnMobile]}>
                                                            <FormikInput
                                                                css={[utils.mb(3), utils.visibleOnMobile]}
                                                                placeholder={messages.AIModal.AddNewSection.Address.CityPlaceholder}
                                                                name='partyInfo.addr.City'
                                                            />
                                                            <FormikSelect
                                                                name='partyInfo.addr.StateProvCd'
                                                                css={[utils.mb(3), styles.subSelect, utils.fullWidth, utils.visibleOnMobile]}
                                                                placeholder={messages.AIModal.AddNewSection.Address.StateProvCdPlaceholder}
                                                                options={aiConfig.auto.states}
                                                                onChange={(e) => {
                                                                    formik.handleChange({
                                                                        target: {
                                                                            name: 'partyInfo.addr.StateProvCd',
                                                                            value: e.value,
                                                                        },
                                                                    })
                                                                }} />
                                                        </div>
                                                    </div>


                                                    : ''
                                                }
                                                <FormikInput
                                                    css={[utils.mb(3)]}
                                                    placeholder={
                                                        (formik.values.partyInfo.addr.RegionCd === '' || formik.values.partyInfo.addr.RegionCd === 'None') ?
                                                            messages.AIModal.AddNewSection.Address.ZipPlaceholder :
                                                            messages.AIModal.AddNewSection.Address.PostalCodePlaceholder}
                                                    name='partyInfo.addr.PostalCode'
                                                />
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <FormGroup key='ai-interest-in' label={messages.AIModal.AddNewSection.HasAnInterestInLabel} css={[styles.formGroup]}>
                                        {
                                            formik.values.linkReference.map((vehicle, index) => (
                                                <li css={styles.listItem} key={`LI-VH-${index}`}>
                                                    <FormikCheckbox
                                                        key={`VH-${index}`}
                                                        name={`linkReference.${index}.status`}
                                                        label={`${vehicle.make} ${vehicle.model}`}
                                                        onChange={(e) => {
                                                            formik.handleChange({
                                                                target: {
                                                                    name: `linkReference.${index}.status`,
                                                                    value: e,
                                                                },
                                                            })
                                                        }}
                                                    />
                                                </li>
                                            ))
                                        }
                                    </FormGroup>
                                    <div css={styles.saveButton}>
                                        <Button type="submit">{messages.AIModal.AddNewSection.AddItem}</Button>
                                    </div>

                                </div>

                            </form>
                        </FormikProvider>

                    </div>
                    : ''}

                {/* ITEMS LIST SECTION */}
                <div css={[utils.fullWidth, styles.itemsContainer]}>
                    <div css={styles.row}>
                        { additionalInterest.length ?
                            additionalInterest
                                .filter(i => i.status === 'Active')
                                .sort((a, b) => +a.sequenceNumber - +b.sequenceNumber)
                                .map((ai, index) => (
                                    <AddInterestItem key={`${index}.ai`} item={ai} index={index} vehicles={formik.values.linkReference}
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

        </Modal>
    )
}
