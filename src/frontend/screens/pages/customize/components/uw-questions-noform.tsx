
import { jsx } from '@emotion/react'
import { FunctionComponent } from "react";
import { useLocale } from "~/frontend/hooks";
import { Text, FormikQuestion } from '~/frontend/components'

import { utils } from '~/frontend/styles'
import { FormikProvider, useFormik } from 'formik';
import { QuestionReply } from '~/types';



interface Props {
    configQuestions: any
    questions: Array<QuestionReply>
    onAnswerChange: (question: string, answer: string) => any,
    title: string,
    isSubQuestionnaire?: boolean,
    formik: any
}

export const UWQuestionsNoForm: FunctionComponent<Props> = ({
    configQuestions,
    questions,
    onAnswerChange,
    title,
    isSubQuestionnaire,
    formik,
    ...props
}) => {
    const { messages } = useLocale()

    return (
        <div>
            {title &&
                <Text size={isSubQuestionnaire ? "1.5em" : "2em"} bold css={utils.mb(4)}>
                    {title}
                </Text>
            }

            <div css={utils.mx('2.5rem')}>
                {questions && questions
                    .map((question, key) => (
                        configQuestions[question.Name] ?
                            <FormikQuestion
                                name={`questions.${key}.Value`}
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
                                            name: `questions.${key}.Value`,
                                            value: e.value,
                                        },
                                    })
                                    onAnswerChange(question.Name, e.value)
                                }}
                            />
                            : ''
                    ))}
            </div>


        </div>
    )
}