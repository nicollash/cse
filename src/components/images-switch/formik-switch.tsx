import { FunctionComponent, Fragment } from 'react'
import { useField } from 'formik'

import { ImagesSwitch, Props } from './switch'

interface FormikProps extends Props {
  name?: string
}

export const FormikImagesSwitch: FunctionComponent<FormikProps> = ({ name, ...props }) => {
  const [field, meta] = useField<any>(name)

  return (
    <Fragment>
      <ImagesSwitch value={field.value} {...props} />
    </Fragment>
  )
}
