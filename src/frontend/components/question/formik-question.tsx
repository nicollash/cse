import { FunctionComponent } from 'react'
import { useField } from 'formik'

import { Question, Props } from './question'

interface FormikProps extends Props {
  name?: string
}

export const FormikQuestion: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<number>(name)

  return (
    <Question
      disabled = {props.disabled}
      value={field.value || null}
      hasError={props.hasError || (meta.touched && !!meta.error)}
      helperText={
        props.helperText || (meta.touched && !!meta.error ? meta.error : undefined)
      }
      {...props}
    />
  )
}
