import { FunctionComponent } from 'react'
import { useField } from 'formik'

import { Select, Props } from './select'

interface FormikProps extends Props {
  name?: string
}

export const FormikSelect: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<number>(name)

  return (
    <Select
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
