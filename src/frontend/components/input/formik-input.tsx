import { FunctionComponent } from 'react'
import { useField } from 'formik'

import { InputProps, Input } from './input'

export const FormikInput: FunctionComponent<InputProps> = (props) => {
  const [field, meta] = useField(props.name)

  return (
    <Input
      {...field}
      value={field.value || ''}
      hasError={props.hasError || (meta.touched && !!meta.error)}
      helperText={props.helperText || (meta.touched ? meta.error : undefined)}
      {...props}
    />
  )
}
