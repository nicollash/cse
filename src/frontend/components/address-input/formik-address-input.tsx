
import { FunctionComponent } from "react";
import { useField } from "formik";

import { TAddressObject } from "~/types";

import { AddressInputProps, AddressInput } from "./address-input";

interface FormikAddressInputProps extends AddressInputProps {
  name: string;
}

export const FormikAddressInput: FunctionComponent<FormikAddressInputProps> = ({
  name,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField<TAddressObject>(name);

  return (
    <AddressInput
      name={name}
      value={field.value || null}
      placeholder={placeholder}
      hasError={props.hasError || (meta.touched && !!meta.error)}
      helperText={
        props.helperText ||
        (meta.touched && !!meta.error ? (meta.error as any).status : undefined)
      }
      {...props}
    />
  );
};
