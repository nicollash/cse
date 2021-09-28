
import { css, jsx } from '@emotion/react'
import { FunctionComponent, useEffect, useState } from "react";
import { useLocale, useQuote } from "~/hooks";
import { AdditionalInterestInfo, AdditionalInterestLinkReferenceInfo, CarCoverageInfo, LossHistoryInfo } from "~/types";
import { Text, Row, Col, FormikInput, FormGroup, Button, FormikSelect, FormikCheckbox, FormikDatePicker } from '~/components'

import { utils, theme } from '~/styles'
import { faChevronUp, faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormikProvider, useFormik } from 'formik';

import * as Yup from 'yup'
import { aiConfig } from '~/utils/configuration/additionalInterest';
import { FormikTextArea } from '~/components/text-area';

import { mediaBreakpointDown } from 'react-grid'
import { lhConfig } from '~/utils/configuration/lossHistory';
import { convertStringToDate } from '~/utils/mapping/helpers';

interface Props {
    item: LossHistoryInfo,
    //vehicles: Array<AdditionalInterestLinkReferenceInfo>
    index: number,
    className?: string,
    onDelete: () => any,
    onEdit: (lh: LossHistoryInfo) => any
}

export const AddLossHistoryItem: FunctionComponent<Props> = ({
    item,
    //vehicles,
    className,
    index,
    onDelete,
    onEdit,
    ...props
}) => {
    const { locale, messages } = useLocale()
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const [edititStatus, setEditing] = useState<{ editing: boolean, cancelled: boolean }>({ editing: false, cancelled: false })

    const {
        quoteDetail
    } = useQuote()

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

    const schema = () => Yup.object().shape({
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
            ...item
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
                    <Text bold>{`#${item.LossHistoryNumber} - ${parseDate(item.LossDt)} - ${item.LossCauseCd}`}</Text>

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
                                            css={[styles.form.map, utils.pl(1)]}
                                            {...props}
                                        >
                                            <Row>
                                                <Col md={12} lg={6}>
                                                    <FormGroup key='fg-LossDt' label={messages.LossHistoryModal.AddNewSection.LossDate} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                        {<FormikDatePicker
                                                            name="LossDt"
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
                                                            css={utils.mb(3)}
                                                            name='CarrierName'
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12} lg={4}>
                                                    <FormGroup key='fg-TypeCd' label={messages.LossHistoryModal.AddNewSection.PolicyType} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                        <FormikSelect
                                                            name='TypeCd'
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
                                                            css={utils.mb(3)}
                                                            name='LossAmt'
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12} lg={4}>
                                                    <FormGroup key='fg-PaidAmt' label={messages.LossHistoryModal.AddNewSection.PaidAmount} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                        <FormikInput
                                                            disabled={formik.values.SourceCd === 'CLUE'}
                                                            css={utils.mb(3)}
                                                            name='PaidAmt'
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12} lg={4}>
                                                    <FormGroup key='fg-VehIdentificationNumber' label={messages.LossHistoryModal.AddNewSection.VehicleVIN} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                        <FormikInput
                                                            disabled={formik.values.SourceCd === 'CLUE'}
                                                            css={utils.mb(3)}
                                                            name='VehIdentificationNumber'
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12} lg={12}>
                                                    <FormGroup key='fg-AtFaultCd' label={messages.LossHistoryModal.AddNewSection.AtFault} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                        <FormikSelect
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
                                                            name='DriverName'
                                                            css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                            placeholder={'Select...'}
                                                            options={[
                                                                ...quoteDetail.drivers.map((driver) => ({
                                                                    label: `${driver.lastName}, ${driver.firstName}`,
                                                                    value: driver.id,
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
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
                                                            disabled={formik.values.SourceCd === 'CLUE'}
                                                            css={[utils.mb(3), styles.interestNameArea]}
                                                            name='LossDesc' />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            {
                                                formik.values.SourceCd != 'CLUE' &&
                                                <div css={styles.saveButton}>
                                                    <Button type="submit">{messages.LossHistoryModal.AddNewSection.Save}</Button>
                                                </div>
                                            }

                                        </form>
                                    </FormikProvider>
                                </div>
                                :
                                <div>
                                    < div css={[styles.actionBar, utils.px(2)]}>
                                        <div css={[styles.icon]}>
                                            <FontAwesomeIcon
                                                icon={formik.values.SourceCd != 'CLUE' ? faPencilAlt : faEye}
                                                css={[styles.iconCustom]}
                                                title={formik.values.SourceCd != 'CLUE'? 'Edit': 'View more'}
                                                onClick={() => {
                                                    setEditing({ editing: true, cancelled: false })
                                                }} />
                                        </div>
                                        {/*<div css={[styles.icon]}>
                                            <FontAwesomeIcon icon={faTrashAlt} css={[styles.iconCustom]}
                                                onClick={() => {
                                                    onDelete()
                                                }} />
                                        </div> */}
                                    </div>
                                    <Row css={[styles.aiItemAligment]}>
                                        <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{'Loss Date'}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {parseDate(item.LossDt)}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={styles.infoItem}>
                                                <Text bold>{'Paid Amount'}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.PaidAmt ? `$${item.PaidAmt}` : `-`}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{'Loss Cause'}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.LossCauseCd}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{'Claim Number'}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.ClaimNumber ? item.ClaimNumber : `-`}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{'Claim Status'}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.ClaimStatusCd ? item.ClaimStatusCd : `-`}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                            <div css={[styles.infoItem]}>
                                                <Text bold>{'Source'}</Text>
                                                <Text size="1" css={utils.mx(1)}>
                                                    {item.SourceCd}
                                                </Text>
                                            </div>
                                        </Col>
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
    justify-content: start;

    &:not(:last-of-type) {
    border-bottom: 1px solid ${theme.borderColor};
    };
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
    min-width: 250px;
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
      border-top-left-radius:10px;
      border-top-right-radius:10px;
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
    min-width: 130px;
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

function parseDate(LossDt: any) {
    if (typeof LossDt === 'object') {
        return ((LossDt.getMonth() > 8) ? (LossDt.getMonth() + 1) :
            ('0' + (LossDt.getMonth() + 1))) + '/' + ((LossDt.getDate() > 9) ?
                LossDt.getDate() : ('0' + LossDt.getDate())) + '/' + LossDt.getFullYear()
    }

    const year = LossDt.substring(0, 4);
    const month = LossDt.substring(4, 6);
    const day = LossDt.substring(6, 8);
    return `${month}/${day}/${year}`
}


