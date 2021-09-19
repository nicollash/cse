import { FunctionComponent, Fragment } from 'react'
import { useField } from 'formik'

import { Switch, Props } from './switch'

interface FormikProps extends Props {
  name?: string
}

export const FormikSwitch: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<any>(name)

  return (
    <Fragment>
      <Switch value={field.value} {...props} />
    </Fragment>
  )
}
