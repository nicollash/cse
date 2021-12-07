import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useFormik, FormikProvider } from "formik";
import parse from "urlencoded-body-parser";
import * as Yup from "yup";

import { useError, useLocale, useMountedRef } from "~/frontend/hooks";
import { EAddressObjectStatus, UserAddressInput } from "~/types";
import { formRedirect, placeAPI } from "~/frontend/utils";
import { isAKnownError } from "~/frontend/contexts";
import { LoginModal, QuoteErrorModal } from "~/frontend/screens/modals";
import {
  Button,
  Container,
  FormikAddressInput,
  FormikInput,
  Heading,
  Screen,
} from "~/frontend/components";
import { styles } from "~/frontend/screens/pages/quote/styles";
import { utils } from "~/frontend/styles";
import { getSession } from "~/backend/lib";
import { AuthService } from "~/backend/services";

function QuotePage({
  user,
  lastError,
  loginError,
  fromLogoutMessage,
  ...props
}) {
  const router = useRouter();
  const { locale, messages } = useLocale();

  const isMountedRef = useMountedRef();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasQuoteError, setQuoteError] = useState<boolean>(false);

  const { setError } = useError();

  useEffect(() => {
    if (lastError) {
      setError(lastError);
    }
  }, [lastError]);

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
          formRedirect("/action/quote/generate", {
            form: JSON.stringify({
              firstName: value.firstName,
              lastName: value.lastName,
              address: value.address,
            }),
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
        });
      //setAddressValided(true)
    },
  });

  useEffect(() => {
    (window as any).ga && (window as any).ga("send", "Quote Page View");
    if (Object.keys(initials).filter((key) => !!initials[key]).length > 0) {
      formik.submitForm();
    }
  }, []);

  useEffect(() => {
    // change error messages when the locale is changed
    isMountedRef?.current &&
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
      <Screen
        title={messages.MainTitle}
        loading={isLoading}
        user={user}
        lastError={lastError}
      >
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
      <LoginModal
        isOpen={!user}
        loginError={loginError}
        fromLogout={!!fromLogoutMessage}
        fromLogoutMessage={fromLogoutMessage}
      />
    </Fragment>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);

  if (req.method === "POST") {
    console.log("login processes: ");
    const { userId, password } = await parse(req);
    const loginResult = await AuthService.login(session, userId, password);

    if (loginResult.success) {
      session.loginError = null;
      session.lastError = null;
    } else {
      session.loginError = loginResult.error;
    }
    session.fromLogoutMessage = null;
  }

  const { lastError, loginError, fromLogoutMessage } = session;

  console.log("session: ", session);
  return {
    props: {
      user: session.user,
      lastError: fromLogoutMessage ? null : lastError,
      loginError,
      fromLogoutMessage,
    },
  };
}

export default QuotePage;
