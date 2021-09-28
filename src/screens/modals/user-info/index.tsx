
import { jsx } from '@emotion/react'
import { FormikProvider, useFormik } from 'formik';
import { FunctionComponent, useMemo } from "react";
import { Button, FormGroup, FormikInput, Modal } from '~/components';
import { useLocale } from '~/hooks'
import * as Yup from 'yup'

import { styles } from './styles'
import { utils } from '~/styles'
import { CommunicationInfo } from '~/types';

interface Props {
    isOpen: boolean
    communicationInfo: CommunicationInfo
    onUpdate?: (v: any) => any
    onCloseModal?: () => any
}


export const UserInfoModal: FunctionComponent<Props> = ({
    isOpen,
    communicationInfo,
    onUpdate,
    onCloseModal,
    ...props
}) => {
    const { locale, messages } = useLocale()

    const schema = () => Yup.object().shape({
        email: Yup.string()
            .email(messages.Common.Errors.InvalidEmailAddress)
            .required(messages.Common.Errors.RequireEmailAddress),
        phone: Yup.string()
            .matches(
                /^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})( x\d{4})?$/gm,
                messages.Common.Errors.InvalidPhoneNumber,
            )
            .required(messages.Common.Errors.RequirePhoneNumber),
    })

    const formik = useFormik<CommunicationInfo>({
        validationSchema: schema,
        validateOnMount: false,
        validateOnChange: true,
        validateOnBlur: false,
        initialValues: {
            email: communicationInfo.email ? (communicationInfo.email === 'x@x.com' ? '' : communicationInfo.email) : '',
            phone: communicationInfo.phone || '',
        },
        onSubmit: (value) => {
            onUpdate(value)
            onCloseModal()
        },
    })

    return (
        <Modal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={true}
            title={messages.UserInfoModal.title}
            onCloseModal={onCloseModal}
            width="750px"
        >
            <FormikProvider value={formik}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        formik.handleSubmit()
                    }}
                    css={styles.form}
                //{...props}
                >
                    <FormGroup label={'Email'}>
                        <FormikInput
                            name='email'
                            css={[utils.mb(3), utils.mx(2), utils.fullWidth]}
                            onChange={(e) => {
                                formik.handleChange(e)
                            }}
                        >
                        </FormikInput>
                    </FormGroup>
                    <FormGroup label={'Phone'}>
                        <FormikInput
                            name='phone'
                            css={[utils.mb(3), utils.mx(2), utils.fullWidth]}
                            onChange={(e) => {
                                formik.handleChange(e)
                            }}
                        >
                        </FormikInput>
                    </FormGroup>
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
                        <Button type="submit">{messages.Common.Save}</Button>
                    </div>
                </form>
            </FormikProvider>
        </Modal>
    )

}