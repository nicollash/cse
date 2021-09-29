import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";

import { useError, useLocale, useQuote } from "~/hooks";
import { EAddressObjectStatus, UserAddressInput } from "~/types";
import { placeAPI } from "~/utils";
import { isAKnownError } from "~/contexts";
import { LoginModal, QuoteErrorModal } from "~/screens/modals";
import {
  Button,
  Container,
  FormikAddressInput,
  FormikInput,
  Heading,
  Screen,
} from "~/components";
import { styles } from "~/screens/pages/customize/single-quote/styles";
import { utils } from "~/styles";
import { getSession } from "~/lib/get-session";

function QuotePage({ isLoggedIn }) {
  const router = useRouter();
  const { locale, messages } = useLocale();
  const { generateQuote } = useQuote();

  const isMountedRef = useRef(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasQuoteError, setQuoteError] = useState<boolean>(false);

  const { setError } = useError();

  const initials =
    (router.query && {
      firstName: (router.query as any).firstName,
      lastName: (router.query as any).lastName,
      address: (router.query as any).address,
      unitNumber: (router.query as any).unitNumber,
    }) ||
    {};

  const schema = useMemo(
    () =>
      Yup.object().shape({
        firstName: Yup.string()
          .label("First Name")
          .required(messages.Common.Errors.RequiredFirstName),
        lastName: Yup.string()
          .label("Last Name")
          .required(messages.Common.Errors.RequiredLastName),
        address: Yup.object()
          .shape({
            address: Yup.string(),
            unitNumber: Yup.string(),
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
      }),
    [messages]
  );

  const formik = useFormik<UserAddressInput>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    initialValues: {
      firstName: initials.firstName || "",
      lastName: initials.lastName || "",
      address: {
        address: initials.address || "",
        unitNumber: initials.unitNumber || "",
        requiredUnitNumber: !!initials.unitNumber,
        status: initials.address
          ? EAddressObjectStatus.success
          : EAddressObjectStatus.addressRequired,
      },
    },
    onSubmit: (value) => {
      setLoading(true);

      placeAPI
        .checkAddress(value.address.address, value.address.unitNumber)
        .then(() => {
          return generateQuote({
            firstName: value.firstName,
            lastName: value.lastName,
            address: value.address,
          })
            .then((res) => {
              router.push(
                `/quote/${res.DTOApplication[0].ApplicationNumber}/customize`
              );
            })
            .catch((e) => {
              // AS IS:
              //if (isAKnownError(e)) {
              setError(e);
              //} else {
              //setQuoteError(true)
              //}
            });
        })
        .catch((err) => {
          if (isAKnownError(err)) {
            setError(err);
          } else {
            formik.setFieldValue("address", {
              ...value.address,
              status: err,
              requiredUnitNumber:
                err === EAddressObjectStatus.unitNumberRequired ||
                value.address.requiredUnitNumber,
            });
          }
        })
        .finally(() => isMountedRef.current && setLoading(false));
      //setAddressValided(true)
    },
  });

  const schemaProductSelect = useMemo(
    () =>
      Yup.object<any>().shape({
        SELECTED_PRODUCT: Yup.string().required("You have to select a product"),
      }),
    [messages]
  );

  const formikProductSelect = useFormik<any>({
    validationSchema: schemaProductSelect,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {},
    onSubmit: (value) => {
      if (value.SELECTED_PRODUCT === "AUTO") {
        setLoading(true);

        placeAPI
          .checkAddress(
            formik.values.address.address,
            formik.values.address.unitNumber
          )
          .then(() => {
            return generateQuote({
              firstName: formik.values.firstName,
              lastName: formik.values.lastName,
              address: formik.values.address,
            })
              .then((res) => {
                router.push(
                  `/quote/${res.DTOApplication[0].ApplicationNumber}/customize`
                );
              })
              .catch((e) => {
                if (isAKnownError(e)) {
                  //setError(e)
                } else {
                  setQuoteError(true);
                }
              });
          })
          .catch((err) => {
            if (isAKnownError(err)) {
              //setError(e)
            } else {
              formik.setFieldValue("address", {
                ...formik.values.address,
                status: err,
                requiredUnitNumber:
                  err === EAddressObjectStatus.unitNumberRequired ||
                  formik.values.address.requiredUnitNumber,
              });
            }
          })
          .finally(() => isMountedRef.current && setLoading(false));
      } else {
        alert("Still not available");
      }
    },
  });

  useEffect(() => {
    isMountedRef.current = true;
    (window as any).ga && (window as any).ga("send", "Quote Page View");

    if (Object.keys(initials).length > 0) {
      formik.submitForm();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // change error messages when the locale is changed
    isMountedRef.current &&
      Object.keys(formik.touched)
        .filter((field) => formik.touched[field] === true)
        .forEach((field) => formik.setFieldTouched(field));
  }, [locale]);

  if (hasQuoteError) {
    return (
      <QuoteErrorModal
        isOpen={true}
        address={formik.values.address}
        firstName={formik.values.firstName}
        lastName={formik.values.lastName}
        onCloseModal={() => setQuoteError(false)}
      />
    );
  }

  return (
    <Fragment>
      <Screen title={messages.MainTitle} loading={isLoading}>
        <div css={[styles.background]}>
          <img src="/assets/images/home-background.png" css={[styles.image]} />
        </div>
        <Container css={styles.container}>
          <Heading css={[utils.mb(6)]}>{messages.Main.Heading}</Heading>

          <FormikProvider value={formik}>
            <form
              data-testid="address-form"
              css={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <FormikInput
                data-testid="input-firstname"
                name="firstName"
                css={[utils.mb(3), styles.nameInput]}
                placeholder={messages.Common.FirstName}
              />
              <FormikInput
                data-testid="input-lastname"
                name="lastName"
                css={[utils.mb(3), styles.nameInput]}
                placeholder={messages.Common.LastName}
              />
              <FormikAddressInput
                data-testid="input-address"
                name="address"
                placeholder={messages.Main.AddressPlaceholder}
                onChange={(address, addressSelected) => {
                  formik.handleChange({
                    target: {
                      name: "address",
                      value: address,
                    },
                  });

                  formik.setFieldTouched("address");

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
              <Button
                data-testid="button-submit"
                type="submit"
                css={styles.quoteBtn}
              >
                {messages.Main.GetQuote}
              </Button>
            </form>
          </FormikProvider>
        </Container>
      </Screen>
      <LoginModal isOpen={!isLoggedIn} />
    </Fragment>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);

  return {
    props: {
      isLoggedIn: !!session.user,
    },
  };
}

export default QuotePage;
