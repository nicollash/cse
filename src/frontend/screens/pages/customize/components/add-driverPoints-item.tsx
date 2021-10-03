
import { css, jsx } from '@emotion/react'
import { FunctionComponent, useEffect, useState } from "react";
import { useLocale, useQuote } from "~/frontend/hooks";
import { AdditionalInterestInfo, AdditionalInterestLinkReferenceInfo, CarCoverageInfo, DriverPointsInfo, LossHistoryInfo } from "~/types";
import { Text, Row, Col, FormikInput, FormGroup, Button, FormikSelect, FormikCheckbox, FormikDatePicker } from '~/frontend/components'

import { utils, theme } from '~/frontend/styles'
import { faChevronUp, faPencilAlt, faTimesCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FormikTextArea } from '~/frontend/components/text-area';

import { mediaBreakpointDown } from 'react-grid'
import { convertDateToString } from '~/frontend/utils/mapping/helpers';
import { ErrorMessage } from 'formik';
import { logger } from '~/helpers';

interface Props {
    item: DriverPointsInfo,
    index: number,
    className?: string,
    formik: any,
    options: { TypeCdList: Array<any>, InfractionCdList: Array<any> }
    onDelete: () => any,
    onCancelCreate: () => any,
    onCreate: () => any,
    onEdit: () => any
}

export const AddDriverPointsItem: FunctionComponent<Props> = ({
    item,
    className,
    formik,
    index,
    options,
    onDelete,
    onEdit,
    onCancelCreate,
    onCreate,
    ...props
}) => {
    const { locale, messages } = useLocale()
    const [collapsed, setCollapsed] = useState<boolean>(true)
    const [edititStatus, setEditing] = useState<{ editing: boolean, cancelled: boolean }>({ editing: false, cancelled: false })
    const [newItem, setNewItem] = useState<boolean>(false)

    useEffect(() => {
        if (collapsed) {
            setEditing({ editing: false, cancelled: true })
        }
    }, [collapsed])

    useEffect(() => {
        if (edititStatus.cancelled) {
            //formik.resetForm();
        }
    }, [edititStatus])


    useEffect(() => {
        if (!item.id) {
            setCollapsed(false)
            setEditing({ editing: true, cancelled: false })
            setNewItem(true)
        }
    }, [])

    return (
        <div css={[styles.container, styles.aiItem]} className={className}>
            <div>
                <div onClick={() => !newItem && setCollapsed(!collapsed)} css={styles.heading}>
                    <Text bold>{`#${item.infractionDt?.getFullYear() || ''} - ${item.sourceCd} - ${item.typeCd || ''}`}</Text>

                    <div css={[styles.icon, collapsed && styles.iconCollapsed]}>
                        <FontAwesomeIcon icon={faChevronUp} />
                    </div>
                </div>
                <div css={[!edititStatus.editing && styles.content, collapsed && styles.contentCollapsed]}>
                    <div css={styles.borderTop}>
                        {
                            edititStatus.editing ?
                                <div css={[styles.addContainer]}>
                                    < div css={[styles.actionBar, utils.px(2)]}>
                                        <div css={[styles.icon]}>
                                            <FontAwesomeIcon icon={faTrashAlt} css={[styles.iconCustom]}
                                                onClick={() => {
                                                    if (newItem) {
                                                        onCancelCreate()
                                                    } else {
                                                        onDelete()
                                                    }
                                                }} />
                                        </div>
                                    </div>
                                    <Row>
                                        <Col md={12} lg={4}>
                                            <FormGroup key='dP-infractionDt' label={'Infraction Date'} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                {<FormikDatePicker
                                                    name={`driverPoints.${index}.infractionDt`}
                                                    css={[utils.mb(3), utils.fullWidth]}
                                                    maxDate={new Date()}
                                                    onChange={(e) => {
                                                        formik.handleChange({
                                                            target: {
                                                                name: `driverPoints.${index}.infractionDt`,
                                                                value: e,
                                                            },
                                                        })
                                                    }}
                                                />}
                                            </FormGroup>
                                        </Col>

                                        <Col md={12} lg={4}>
                                            <FormGroup key='dP-TypeCd' label={'Type'} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                <FormikSelect
                                                    name={`driverPoints.${index}.typeCd`}

                                                    css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                    placeholder={'Select...'}
                                                    options={options.TypeCdList}
                                                    onChange={(e) => {
                                                        formik.handleChange({
                                                            target: {
                                                                name: `driverPoints.${index}.typeCd`,
                                                                value: e.value,
                                                            },
                                                        })
                                                    }} />
                                            </FormGroup>
                                        </Col>

                                        <Col md={12} lg={4}>
                                            <FormGroup key='dP-convictionDt' label={'Conviction Date'} css={[styles.linearLines, utils.mr(2)]} textContainerClassName='linearLabelWithValidation'>
                                                {<FormikDatePicker
                                                    name={`driverPoints.${index}.convictionDt`}
                                                    css={[utils.mb(3), utils.fullWidth]}
                                                    maxDate={new Date()}
                                                    onChange={(e) => {
                                                        formik.handleChange({
                                                            target: {
                                                                name: `driverPoints.${index}.convictionDt`,
                                                                value: e,
                                                            },
                                                        })
                                                    }}
                                                />}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>

                                        <Col md={12} lg={12}>
                                            <FormGroup key='dP-Infraction' label={'Infraction'} css={[styles.linearLines, utils.mr(2)]}
                                                textContainerClassName='linearLabelWithValidation' containerClassName='customInfractionContainer'>
                                                <FormikSelect
                                                    name={`driverPoints.${index}.infractionCd`}
                                                    css={[utils.mb(3), styles.subSelect, utils.fullWidth]}
                                                    placeholder={'Select...'}
                                                    options={options.InfractionCdList}
                                                    onChange={(e) => {
                                                        formik.handleChange({
                                                            target: {
                                                                name: `driverPoints.${index}.infractionCd`,
                                                                value: e.value,
                                                            },
                                                        })
                                                    }} />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={12} lg={12}>
                                            <FormGroup key='dP-comments' label={'Comments'}
                                                css={[styles.linearLines, styles.interestNameContainer]}
                                                textContainerClassName='linearLabelWithValidationTextArea'
                                                containerClassName='customNameContainer'>
                                                <FormikTextArea
                                                    css={[utils.mb(3), styles.interestNameArea]}
                                                    name={`driverPoints.${index}.comments`} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div
                                        css={[
                                            utils.centerAlign,
                                            utils.fullWidth,
                                            utils.position('relative'),
                                            utils.mt(4),
                                        ]}
                                    >

                                        <Button type="button"
                                            css={utils.mb(1)}
                                            onClick={() => {
                                                formik.validateForm().then((value) => {
                                                    if (Object.entries(value).length != 0) {
                                                        logger(value)
                                                        formik.handleSubmit()
                                                    } else {
                                                        setEditing({ editing: false, cancelled: false })
                                                        if (newItem) {
                                                            setNewItem(false)
                                                            onCreate()
                                                        } else {
                                                            onEdit()
                                                        }
                                                    }
                                                })

                                            }}>{newItem ? 'Add' : 'Save'}</Button>
                                    </div>
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
                                    {
                                        <Row css={[styles.aiItemAligment]}>
                                            <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                                <div css={[styles.infoItem]}>
                                                    <Text bold>{'Date'}</Text>
                                                    <Text size="1" css={utils.mx(1)}>
                                                        {item.infractionDt ? `${parseDateToString(item.infractionDt)}` : `-`}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                                <div css={styles.infoItem}>
                                                    <Text bold>{'Source'}</Text>
                                                    <Text size="1" css={utils.mx(1)}>
                                                        {item.sourceCd ? `${item.sourceCd}` : `-`}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                                <div css={[styles.infoItem]}>
                                                    <Text bold>{'Infraction'}</Text>
                                                    <Text size="1" css={utils.mx(1)}>
                                                        {item.infractionCd ? item.infractionCd : `-`}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                                <div css={[styles.infoItem]}>
                                                    <Text bold>{'Expires'}</Text>
                                                    <Text size="1" css={utils.mx(1)}>
                                                        {item.expirationDt ? parseDateToString(item.expirationDt) : `-`}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                                <div css={[styles.infoItem]}>
                                                    <Text bold>{'Good Driver Points'}</Text>
                                                    <Text size="1" css={utils.mx(1)}>
                                                        {item.goodDriverPoints ? item.goodDriverPoints : `-`}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col md={12} lg={4} css={[styles.aiItemAligment, utils.mt('-1px')]}>
                                                <div css={[styles.infoItem]}>
                                                    <Text bold>{'Points Charged'}</Text>
                                                    <Text size="1" css={utils.mx(1)}>
                                                        {item.pointsCharged ? item.pointsCharged : `-`}
                                                    </Text>
                                                </div>
                                            </Col>
                                        </Row>
                                    }
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

function parseDateToString(LossDt: any) {
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


