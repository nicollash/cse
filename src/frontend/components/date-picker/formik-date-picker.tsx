import { FunctionComponent } from 'react'
import { useField } from 'formik'

import { DatePicker, Props } from './date-picker'

interface FormikProps extends Props {
  name?: string
  disabled?:boolean
}

export const FormikDatePicker: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<Date>(name)

  return (
    <DatePicker
      disabled={props.disabled}
      value={field.value || null}
      hasError={props.hasError || (meta.touched && !!meta.error)}
      helperText={
        props.helperText || (meta.touched && !!meta.error ? meta.error : undefined)
      }
      {...props}
    />
  )
}
