
import { css, jsx } from '@emotion/react'
import { FunctionComponent, useEffect, useState } from "react";
import { useLocale } from "~/hooks";
import { AdditionalInterestInfo, AdditionalInterestLinkReferenceInfo, CarCoverageInfo } from "~/types";
import { Text, Row, Col, FormikInput, FormGroup, Button, FormikSelect, FormikCheckbox } from '~/components'

import { utils, theme } from '~/styles'
import { faChevronUp, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProvider, useFormik } from 'formik';

import * as Yup from 'yup'
import { aiConfig } from '~/utils/configuration/additionalInterest';
import { FormikTextArea } from '~/components/text-area';

import { mediaBreakpointDown } from 'react-grid'

interface Props {
    item: AdditionalInterestInfo,
    vehicles: Array<AdditionalInterestLinkReferenceInfo>
    index: number,
    className?: string,
    onDelete: () => any,
    onEdit: (ai: AdditionalInterestInfo) => any
}

export const AddInterestItem: FunctionComponent<Props> = ({
    item,
    vehicles,
    className,
    index,
    onDelete,
    onEdit,
    ...props
}) => {
    const { locale, messages } = useLocale()
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const [edititStatus, setEditing] = useState<{ editing: boolean, cancelled: boolean }>({ editing: false, cancelled: false })

    useEffect(() => {
        if (collapsed) {
            setEditing({ editing: false, cancelled: true })
        }
    }, [collapsed])

    useEffect(() => {
        if (edititStatus.cancelled) {
            formik.resetForm();
        }
    }, [edititStatus])

    function getFullAvailableVehicles(linkReference: AdditionalInterestLinkReferenceInfo[]) : AdditionalInterestLinkReferenceInfo[] {
        const missingVehicles = vehicles.filter(vh => !linkReference.find(lR => lR.id === vh.id))
        return [...linkReference, ...missingVehicles];
    }

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
            ...item,
            linkReference: getFullAvailableVehicles(item.linkReference)
        },
        onSubmit: (value) => {
            onEdit(value)
            setEditing({ editing: false, cancelled: false })
        },
    })

    return (
        <div css={[styles.container, styles.aiItem]} className={className}>
            <div>
                <div onClick={() => setCollapsed(!collapsed)} css={styles.heading}>
                    <Text bold>{`${item.interestTypeCd ? item.interestTypeCd : 'Additional Insured'}`}</Text>

                    <div css={[styles.icon, collapsed && styles.iconCollapsed]}>
                        <FontAwesomeIcon icon={faChevronUp} />
                    </div>
                </div>
                <div css={[!edititStatus.editing && styles.content, collapsed && styles.contentCollapsed]}>
                    <div css={styles.borderTop}>
                        {
                            edititStatus.editing ?
                                <div css={[styles.addContainer]}>

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
                                                        textContainerClassName='linearLabelWithValidation'
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
                                                            <li css={styles.listItemEdit} key={`LI-VH-${index}`}>
                                                                <FormikCheckbox
                                                                    key={`VH-${index}`}
                                                                    name={`linkReference.${index}.status`}
                                                                    label={`${vehicle.description}`}
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

                                            </div>

                                            <div
                                                css={[
                                                    utils.centerAlign,
                                                    utils.fullWidth,
                                                    utils.position('relative'),
                                                    utils.my(4),
                                                ]}
                                            >
                                                <Button
                                                    type="button"
                                                    buttonType="secondary"
                                                    css={utils.mr(5)}
                                                    onClick={() => { setEditing({ editing: false, cancelled: true }) }}
                                                >
                                                    {messages.Common.Cancel}
                                                </Button>
                                                <Button type="submit">{messages.Common.Update}</Button>
                                            </div>
                                        </form>
                                    </FormikProvider>
                                </div>
                                :
                                <div>
                                    < div css={[styles.actionBar, utils.px(2)]}>
                                        <div css={[styles.icon]}>
                                            <FontAwesomeIcon icon={faPencilAlt} css={[styles.iconCustom]}
                                                onClick={() => {
                                                    setEditing({ editing: true, cancelled: false })
                                                }} />
                                        </div>
                                        <div css={[styles.icon]}>
                                            <FontAwesomeIcon icon={faTrashAlt} css={[styles.iconCustom]}
                                                onClick={() => {
                                                    onDelete()
                                                }} />
                                        </div>
                                    </div>
                                    <Row css={[styles.aiItemAligment]}>
                                        <Col md={12} lg={6} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{messages.AIModal.AddNewSection.NameLabel}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.interestName}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={6} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={styles.infoItem}>
                                                <Text bold>{messages.AIModal.AddNewSection.InterestType}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.interestTypeCd}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={6} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{messages.AIModal.AddNewSection.LoanLabel}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.accountNumber}
                                                </Text>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row css={[styles.aiItemAligment]}>
                                        <Col md={12} lg={item.linkReference.length > 0 ? 6 : 10} css={[utils.mt('-1px'), styles.aiItemAligment]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{`${messages.AIModal.AddNewSection.Address.Label}: `}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.partyInfo.addr.Addr1}
                                                </Text>
                                            </div>
                                        </Col>
                                        {item.linkReference.length > 0 ?
                                            <Col md={12} lg={6} css={[utils.mt('-1px')]}>
                                                <div css={[styles.infoItem, styles.interestInContainer]}>
                                                    <Text bold>{messages.AIModal.AddNewSection.HasAnInterestInLabel}</Text>
                                                    {
                                                        item.linkReference.map((lr, index) => (
                                                            <li css={styles.listItem} key={`LI-II-${index}`}>
                                                                {`${lr.description}`}
                                                            </li>
                                                        ))
                                                    }
                                                </div>
                                            </Col>
                                            : ''
                                        }
                                    </Row>
                                </div>
                        }
                    </div>

                </div>
            </div>
        </div >
    )

}
const styles = {
    container: css`
    background-color: white;
    border-radius: 10px;
    flex-direction: column;
`,

    heading: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
`,

    icon: css`
    font-size: 1em;
    font-weight: bold;

    transition: all 0.3s;
`,

    iconCollapsed: css`
    transform: rotate(180deg);
`,

    content: css`
    width: 100%;
    max-height: 1000px;
    transition: max-height 0.3s;
    overflow: hidden;
    padding: 0 2em;
`,

    contentCollapsed: css`
    max-height: 0;
`,

    aiItemAligment: css`
    padding-left: 0.4rem !important;
    justify-content: start;
`,
    borderBottom: css`
    border-bottom: 1px solid ${theme.borderColor};
    `,
    borderTop: css`
    border-top: 1px solid ${theme.borderColor};
    `,
    infoItem: css`
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: start

    &:not(:last-of-type) {
    border-bottom: 1px solid ${theme.borderColor};
    }
    align-items: baseline !important;
`,
    aiItem: css`
    width: 100%;
    background-color:#f5f7f8;     
    margin-bottom: 0.5rem; 
    `,
    interestInContainer: css`
    flex-direction: column;
    `,
    listItem: css`
    /*list-style-type: none;*/
    `,
    iconCustom: css`
    cursor:pointer;
    margin: 0.5rem;
    `,
    actionBar: css`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    `,
    sameColumn: css`
    flex-direction: column;
    `,
    subSelect: css`
    color: #000000;
    /*min-width: 300px;*/
  `,

    form: css``,

    row: css`
    /*margin: 0 -50px 0;*/
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: column;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

    formGroup: css`
    margin: 0 2rem;
    min-width: 200px;
    flex: 1;
  `,

    deleteButton: css`
    position: absolute;
    left: 0;
  `,
    /*icon: css`
    font-size: 2em;
    font-weight: bold;
    cursor: pointer;

    transition: all 0.3s;
    `,*/
    addSection: css`
        flex-direction: row;
        justify-content: flex-end;
        display: flex;
        padding-bottom: 1rem;
    `,
    linearLines: css`
        display: flex !important;
        flex-wrap: wrap;
        flex-direction: row;    
    `,
    aiInformation: css`
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
    `,
    newItemForm: css`
      align-items: flex-start;
      flex-direction: initial;
    `,
    addContainer: css`
      border-top-left-radius 10px;
      border-top-right-radius 10px;
      background-color:#f5f7f8;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      padding-top: 1rem;
      margin-bottom: 2rem;
    `,
    itemsContainer: css`
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    `,
    listItemEdit: css`
      list-style-type: none;
    `,
    saveButton: css`
    width: 100%;
    display: flex !important;
    justify-content: center;
    margin-bottom: 1rem;
    `,
    linearLabelWithValidation: css`
    align-items: baseline;
    margin-top: 1rem;
    `,
    addressInputContainer: css`
    min-width: 50%;
    `,
    regionCd: css`
    max-width: 350px
    `,
    cityStateContainer: css`
    width: 100%;
    /*max-width: 50%;*/
    `,
    stateProvCd: css`
    width: 50%;
    `,
    city: css`
    width: 50%;
    `,
    cancelBottomContainer: css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
    `,
    cancelBottom: css`
    color: #f5f7f8;
    `,
    firstLineContainer: css`
    min-width: 50%;
    `,
    formPadding: css`
    padding: 0 2rem;
    `,
    interestNameContainer: css`
    min-width:50%;
    ${mediaBreakpointDown('md')} {
        width: 100%
      }
    `,
    interestNameArea: css`
    min-width:80%
    `
}

