import { FunctionComponent } from 'react'
import { useField } from 'formik'

import { Spinner, Props } from './spinner'

interface FormikProps extends Props {
  name?: string
}

export const FormikSpinner: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<number>(name)

  return (
    <Spinner
      value={+field.value || 0}
      hasError={props.hasError || (meta.touched && !!meta.error)}
      helperText={
        props.helperText || (meta.touched && !!meta.error ? meta.error : undefined)
      }
      {...props}
    />
  )
}
