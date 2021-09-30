import { FunctionComponent } from 'react'
import { useField } from 'formik'

import { TextAreaProps, TextArea } from './text-area'

export const FormikTextArea: FunctionComponent<TextAreaProps> = (props) => {
  const [field, meta] = useField(props.name)

  return (
    <TextArea
      {...field}
      value={field.value || ''}
      hasError={props.hasError || (meta.touched && !!meta.error)}
      helperText={props.helperText || (meta.touched ? meta.error : undefined)}
      {...props}
    />
  )
}
