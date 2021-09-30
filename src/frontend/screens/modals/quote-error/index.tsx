import { jsx } from "@emotion/react";
import { FunctionComponent, useMemo, useState, useRef, useEffect } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";

import {
  Modal,
  FormikInput,
  Button,
  FormikAddressInput,
  Loading,
  Heading,
  Text,
} from "~/frontend/components";
import { utils } from "~/frontend/styles";
import {
  TAddressObject,
  UserAddressInput,
  EAddressObjectStatus,
} from "~/types";

import { styles } from "./styles";
import { placeAPI } from "~/frontend/utils";
import { useError, useLocale, useMountedRef, useQuote } from "~/frontend/hooks";
import { useRouter } from "next/router";
import { isAKnownError } from "~/frontend/contexts/error-context";

interface QuoteErrorModalProps {
  isOpen: boolean;
  address: TAddressObject;
  firstName: string;
  lastName: string;
  onCloseModal: () => any;
}
export const QuoteErrorModal: FunctionComponent<QuoteErrorModalProps> = ({
  isOpen,
  address,
  firstName,
  lastName,
  onCloseModal,
  ...props
}) => {
  const { locale, messages } = useLocale();
  const { generateQuote } = useQuote();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const isMountedRef = useMountedRef();
  const { setError } = useError();

  const schema = useMemo(() => getSchema(messages), [locale]);

  const formik = useFormik<UserAddressInput>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      address: address
        ? address
        : {
            address: "",
            unitNumber: "",
            requiredUnitNumber: false,
            status: EAddressObjectStatus.invalidAddress,
          },
    },
    onSubmit: (value) => {
      setLoading(true);

      placeAPI
        .checkAddress(value.address.address, value.address.unitNumber)
        .then(() => {
          generateQuote({
            firstName: value.firstName,
            lastName: value.lastName,
            address: value.address,
          })
            .then((res) => {
              setLoading(false);
              router.push(
                `/quote/${res.DTOApplication[0].ApplicationNumber}/customize`
              );
            })
            .catch(() => {
              setLoading(false);
            });
        })
        .catch((err) => {
          if (isAKnownError(err)) {
            //setError(err)
          } else {
            formik.setFieldValue("address", {
              ...value.address,
              status: err,
              requiredUnitNumber:
                err === EAddressObjectStatus.unitNumberRequired ||
                value.address.requiredUnitNumber,
            });
          }
        });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      title={messages.QuoteError.Title}
      onCloseModal={onCloseModal}
      width="1100px"
    >
      <Text bold size="1.5em">
        {messages.QuoteError.Heading}
      </Text>
      <Text>{messages.QuoteError.SubHeading}</Text>
      <FormikProvider value={formik}>
        <form
          css={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          {...props}
        >
          <div css={styles.row}>
            <FormikInput
              name="firstName"
              css={[utils.mb(3), styles.nameInput]}
              placeholder={messages.Common.FirstName}
            />
            <FormikInput
              name="lastName"
              css={[utils.mb(3), styles.nameInput]}
              placeholder={messages.Common.LastName}
            />
          </div>
          <div css={styles.row}>
            <FormikAddressInput
              name="address"
              placeholder={messages.QuoteError.AddressPlaceholder}
              onChange={(address, addressSelected) => {
                formik.handleChange({
                  target: {
                    name: "address",
                    value: {
                      ...address,
                      status: EAddressObjectStatus.success,
                    },
                  },
                });

                if (addressSelected) {
                  formik.handleSubmit();
                }
              }}
              onClearAddress={() => {
                formik.handleChange({
                  target: {
                    name: "address",
                    value: {
                      address: "",
                      unitNumber: "",
                      status: EAddressObjectStatus.success,
                      unitNumberRequired: false,
                    },
                  },
                });
              }}
              css={[utils.flex(1), utils.mb(3)]}
            />
            <Button type="submit" css={styles.quoteBtn}>
              {messages.Main.GetQuote}
            </Button>
          </div>
        </form>
      </FormikProvider>
      {loading && <Loading />}
    </Modal>
  );
};

const getSchema = (messages) =>
  Yup.object().shape({
    firstName: Yup.string()
      .label("First Name")
      .required(messages.Common.Errors.RequiredFirstName),
    lastName: Yup.string()
      .label("Last Name")
      .required(messages.Common.Errors.RequiredLastName),
    address: Yup.object()
      .shape({
        status: Yup.number()
          .test(
            "addressValidation",
            messages.Common.Errors.RequiredAddress,
            (v: EAddressObjectStatus) =>
              v !== EAddressObjectStatus.addressRequired
          )
          .test(
            "invalidAddress",
            messages.Common.Errors.InvalidAddress,
            (v: EAddressObjectStatus) =>
              v !== EAddressObjectStatus.invalidAddress
          )
          .test(
            "unitNumberRequired",
            messages.Common.Errors.RequiredUnitNumber,
            (v: EAddressObjectStatus) =>
              v !== EAddressObjectStatus.unitNumberRequired
          )
          .test(
            "invalidUnitNumber",
            messages.Common.Errors.InvalidUnitNumber,
            (v: EAddressObjectStatus) =>
              v !== EAddressObjectStatus.invalidUnitNumber
          ),
      })
      .label("Address"),
  });
