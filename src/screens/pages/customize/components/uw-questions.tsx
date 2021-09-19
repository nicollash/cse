
import { jsx } from '@emotion/react'
import { FunctionComponent } from "react";
import { useLocale } from "~/hooks";
import { Text, FormikQuestion } from '~/components'

import { utils } from '~/styles'
import { FormikProvider, useFormik } from 'formik';
import { QuestionReply } from '~/types';



interface Props {
    configQuestions: any
    uwQuestions: Array<QuestionReply>
    onAnswerChange: (question: string, answer: string) => any,
    title: string,
    isSubQuestionnaire?: boolean
}

export const UWQuestions: FunctionComponent<Props> = ({
    configQuestions,
    uwQuestions,
    onAnswerChange,
    title,
    isSubQuestionnaire,
    ...props
}) => {
    const formik = useFormik<any>({
        validationSchema: null,
        validateOnMount: false,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        initialValues: {
            uwQuestions
        },
        onSubmit: () => {
        },
    })

    return (
        <div>
            {title &&
                <Text size={isSubQuestionnaire ? "1.5em" : "2em"} bold css={utils.mb(4)}>
                    {title}
                </Text>
            }
            <FormikProvider value={formik}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        formik.handleSubmit()
                    }}

                //css={styles.form}
                //{...props}
                >
                    <div css={utils.mx('2.5rem')}>
                        {uwQuestions
                            .map((question, key) => (
                                configQuestions[question.Name] ?
                                    <FormikQuestion
                                        name={`uwQuestions.${key}.Value`}
                                        subText={configQuestions[question.Name].subText}
                                        key={`question-${key}`}
                                        css={[utils.fullWidth, utils.mb(3)]}
                                        options={configQuestions[question.Name].options}
                                        description={configQuestions[question.Name].desciption}
                                        boldDesciption={configQuestions[question.Name].boldDesciption}
                                        boldSubText={configQuestions[question.Name].boldSubText}
                                        onChange={(e) => {
                                            formik.handleChange({
                                                target: {
                                                    name: `uwQuestions.${key}.Value`,
                                                    value: e.value,
                                                },
                                            })
                                            onAnswerChange(question.Name, e.value)
                                        }}
                                    />
                                    : ''
                            ))}
                    </div>
                </form>
            </FormikProvider>

        </div>
    )
}