import { FunctionComponent, Fragment } from 'react'
import { useField } from 'formik'

import { Checkbox, Props } from './checkbox'

interface FormikProps extends Props {
  name?: string
}

export const FormikCheckbox: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<any>(name)

  return (
    <Fragment>
      <Checkbox
        value={field.value}
        {...props}
        hasError={props.hasError || (meta.touched && !!meta.error)}
        helperText={
          props.helperText || (meta.touched && !!meta.error ? meta.error : undefined)
        }
        {...props}
      />
    </Fragment>
  )
}
