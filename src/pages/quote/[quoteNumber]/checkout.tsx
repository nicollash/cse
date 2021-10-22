import {
  FunctionComponent,
  Fragment,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faPencilAlt,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
  Container,
  FormGroup,
  Screen,
  Text,
  Hr,
  Button,
  Switch,
} from "~/components";
import {
  UserAddressInput,
  TAddressObject,
  EAddressObjectStatus,
  CustomError,
  CommunicationInfo,
  QuoteDetail,
} from "~/types";
import { theme, utils } from "~/styles";
import { loadScript, logger } from "~/utils";
import { placeAPI } from "~/utils";
import { PaymentOptions } from "~/options";
import { useError, useLocale, useQuote } from "~/hooks";

import { styles } from "~/screens/pages/checkout/styles";
import { oneIncInvokePortal } from "~/services";
import { UserInfoModal } from "~/screens/modals/user-info";
import { config } from "~/config";
import { ErrorBox } from "~/components/error-box";
import { useRouter } from "next/router";
import { AuthGuard } from "~/screens/guards";
import { QuoteLayout } from "~/screens/layouts";

const CheckoutPage: FunctionComponent = () => {
  const router = useRouter();
  const { locale, messages } = useLocale();
  const quoteNumber = router.query.quoteNumber as string;
  const {
    quoteDetail,
    insurer,
    policy,
    issuePolicy,
    updateDownPaymentDetailsPostOneIncSave,
    externalApplicationCloseOut,
    getQuote,
  } = useQuote();
  const { setError } = useError();

  const [paymentFrequency, setPaymentFrequency] = useState("full");
  const [isPaid, setPaid] = useState(false);
  const [canIssuePolicy, setIssuePolicy] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [reducedPaymentMethodInfo, setReducedPaymentMethodInfo] =
    useState(null);
  const [oneIncScriptLoaded, setOneIncScriptLoaded] = useState(null);
  const [amountToPay, setAmountToPay] = useState("$");
  const [paymentMethodErrors, setPaymentMethodErrors] = useState([]);

  useEffect(() => {
    (window as any).ga && (window as any).ga("send", "Checkout Page View");
  }, []);

  const processExternalApplicationCloseOut = useCallback(
    (updatedQuote: QuoteDetail) => {
      setLoading(true);
      externalApplicationCloseOut(updatedQuote)
        .then(() => {
          formik.values.communicationInformation =
            updatedQuote.communicationInfo;
          setUserInfoVisible(false);
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    if (
      quoteDetail.planDetails.paymentMethod != null &&
      quoteDetail.planDetails.paymentMethod.oneIncPaymentToken != undefined
    ) {
      setReducedPaymentMethodInfo(quoteDetail.planDetails.paymentMethod);
      setIssuePolicy(true);
    }
  }, [reducedPaymentMethodInfo]);

  useEffect(() => {
    setPaymentFrequency(quoteDetail.planDetails.paymentPlan);
  }, []);

  useEffect(() => {
    if (paymentFrequency === "full") {
      setAmountToPay(
        (
          parseFloat(quoteDetail.planDetails.fullPrice) +
          parseFloat(quoteDetail.planDetails.writtenFeeAmt)
        )
          .toFixed(2)
          .toString()
      );
    } else {
      setAmountToPay(
        quoteDetail.planDetails.paymentSchedule
          .map((x) => parseFloat(x.BillAmt))
          .reduce((a, b) => a + b)
          .toFixed(2)
      );
    }
  }, [paymentFrequency]);

  const schema = useMemo(() => getSchema(messages), [locale]);

  const formik = useFormik<UserInput>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      billingInformation: {
        firstName: insurer.firstName,
        lastName: insurer.lastName,
        address: insurer.address,
      },
      communicationInformation: quoteDetail.communicationInfo,
      paymentFrequency: "",
      paymentMethod: "",
    },
    onSubmit: (value) => {
      setLoading(true);

      placeAPI
        .checkAddress(
          value.billingInformation.address.address,
          value.billingInformation.address.unitNumber
        )
        .then(
          async () => {
            try {
              const data = await oneIncInvokePortal({
                OperationType: "savePaymentMethod",
                PaymentMethodCd: "UserSelect",
                ApplicationRef: quoteDetail.planDetails.systemId,
              });

              openOneInc(
                "savePaymentMethod",
                data.ModalJSONRequest,
                (data: any) => {
                  onSavePaymentMethod(data);
                }
              );
            } catch (e) {
              setError(e);
            }
          },
          (res) => {
            formik.handleChange({
              target: {
                name: "billingInformation.address",
                value: {
                  ...value.billingInformation.address,
                  requiredUnitNumber:
                    res === EAddressObjectStatus.unitNumberRequired ||
                    value.billingInformation.address.requiredUnitNumber,
                  status: res,
                },
              },
            });
          }
        )
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const handleIssuePolicy = (pf: string, amountToPay: string) => {
    logger(`${amountToPay}`);
    setLoading(true);
    issuePolicy(amountToPay, pf).then(() => {
      setPaid(true);
    })
      .catch((e) => {
        logger(e);
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const onSavePaymentMethod = useCallback(async (data: any) => {
    setLoading(true);
    await updateDownPaymentDetailsPostOneIncSave(data)
      .then(() => {
        setReducedPaymentMethodInfo(data); //For payment method label
        setIssuePolicy(true);
        setPaymentMethodErrors([]);
      })
      .catch((e: any) => {
        setPaymentMethodErrors([
          ...e.map((error) => ({
            TypeCd: error.errorData.Type,
            Msg: error.errorData.Message,
          })),
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const openOneInc = (
    operationType: string,
    jsonRequest: any,
    callback: any
  ) => {
    if (!oneIncScriptLoaded) {
      loadScript("oneIncPaymentScriptLoader", config.oneIncPaymentLib, () => {
        const oneInc = (window as any).$("#portalOneContainer");
        oneInc.portalOne();
        setOneIncScriptLoaded(true);

        oneIncOperationSwith(operationType, jsonRequest, oneInc);

        //Configuration for On events
        oneInc.on("portalOne.saveComplete", function (e, data) {
          if (data) {
            callback(data);
          }
        });
      });
    } else {
      const oneInc = (window as any).$("#portalOneContainer");
      oneInc.portalOne();

      oneIncOperationSwith(operationType, jsonRequest, oneInc);
    }
  };

  const oneIncOperationSwith = (
    operationType: string,
    jsonRequest: any,
    oneInc: any
  ) => {
    try {
      if (operationType === "savePaymentMethod") {
        oneInc.data("portalOne").savePaymentMethod(jsonRequest);
      }
    } catch (error) {
      const { errorType, errorData } = error as CustomError;
      setError([
        new CustomError(errorType, { ...(errorData || {}), quoteNumber }),
      ]);
    }
  };

  const diableIssuePolicy = (): boolean => {
    return (
      // canIssuePolicy
      !canIssuePolicy ||
      // quoteDetail.validationError
      (quoteDetail.validationError &&
        quoteDetail.validationError.length > 0 &&
        quoteDetail.validationError.filter((e) => e.TypeCd != "Warning")
          .length > 0) ||
      // paymentMethodErrors
      paymentMethodErrors.length > 0
    );
  };

  return (
    <Screen
      title={`${quoteNumber} | ${messages.MainTitle}`}
      greyBackground
      breadCrumb={
        isPaid
          ? [
              { link: "/quote", label: "Home" },
              { label: "Customize" },
              { label: "Review Coverages" },
              { label: "Checkout" },
            ]
          : [
              { link: "/quote", label: "Home" },
              { link: `/quote/${quoteNumber}/customize`, label: "Customize" },
              { link: `/quote/${quoteNumber}/review`, label: "Review Coverages" },
              { label: "Checkout" },
            ]
      }
      loading={isLoading}
      css={[utils.flex(1), utils.flexDirection("column")]}
      quoteNumber={quoteNumber}
      systemId={quoteDetail.systemId}
    >
      <Container wide css={[utils.fullWidth, utils.px(0)]}>
        <Text size="2.5em" bold css={[utils.mb(4), utils.px("50px")]}>
          {messages.Checkout.Title}
        </Text>

        {quoteDetail.validationError && quoteDetail.validationError.length > 0 && (
          <div css={[utils.mb(3), utils.hideOnMobile]}>
            <ErrorBox
              data={[...quoteDetail.validationError, ...paymentMethodErrors]}
              systemId={quoteDetail.systemId}
              isQuote={quoteDetail.planDetails.isQuote}
            />
          </div>
        )}

        {quoteDetail.validationError && quoteDetail.validationError.length > 0 && (
          <div css={[utils.mb(3), utils.fullWidth, utils.visibleOnMobile]}>
            <ErrorBox
              data={[...quoteDetail.validationError, ...paymentMethodErrors]}
              systemId={quoteDetail.systemId}
              isQuote={quoteDetail.planDetails.isQuote}
            />
          </div>
        )}

        <FormikProvider value={formik}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            css={[utils.mb("35px"), utils.mt("35px"), utils.px("50px")]}
          >
            <div css={styles.checkoutInformation}>
              <div css={utils.flex(0.5)}>
                <Text size="2em" weight="600">
                  <Text size="0.7em">
                    <FontAwesomeIcon css={utils.mr(3)} icon={faCommentAlt} />
                  </Text>
                  {messages.Checkout.CommunicationInformation}
                  <Text size="0.5em">
                    <FontAwesomeIcon
                      onClick={() => {
                        setUserInfoVisible(true);
                      }}
                      css={[utils.mx(3), styles.iconCustom]}
                      icon={faPencilAlt}
                    />
                  </Text>
                </Text>

                <div css={[utils.pl("3rem"), utils.mt(1)]}>
                  <Text
                    bold={true}
                    css={utils.mr(2)}
                  >{`${messages.Common.Email}: `}</Text>
                  <Text bold>
                    {formik.values.communicationInformation.email}
                  </Text>
                </div>
                <div css={utils.pl("3rem")}>
                  <Text
                    bold={true}
                    css={utils.mr(2)}
                  >{`${messages.Common.Phone}: `}</Text>
                  <Text bold>
                    {formik.values.communicationInformation.phone}
                  </Text>
                </div>
              </div>
            </div>
          </form>
        </FormikProvider>
      </Container>

      <div css={styles.whiteBackground}>
        <Container wide css={[utils.pb(7), utils.pt(4)]}>
          <Text size="2em" weight="600">
            <Text size="0.7em">
              <FontAwesomeIcon icon={faCreditCard} css={utils.mr(3)} />
            </Text>
            {messages.Checkout.PaymentInformation}
          </Text>

          <div css={styles.paymentInformation.container}>
            <div
              css={[
                utils.display("flex"),
                utils.alignItems("center"),
                utils.justifyContent("space-between"),
                styles.paymentInformation.header,
              ]}
            >
              <Text size="1.75em" bold css={utils.alignItems("center")}>
                <img
                  src="/assets/icons/car1.png"
                  css={utils.mr(1)}
                  width="24px"
                />
                {messages.Common.Auto}
              </Text>

              <div css={[utils.centerAlign, utils.pa(3)]}>
                <Text
                  size="1.2em"
                  bold
                  color={theme.color.primary}
                  css={utils.mr(3)}
                >
                  {quoteDetail.planDetails.planType} {messages.Common.Plan}
                </Text>
                <Text size="1.2em" bold>
                  {`$${amountToPay}`}
                </Text>
              </div>
            </div>

            {isPaid && policy ? (
              <div
                css={[
                  utils.display("flex"),
                  utils.alignItems("center"),
                  utils.flexDirection("column"),
                ]}
              >
                <Text
                  size="2em"
                  css={utils.my(3)}
                  color={theme.color.primary}
                  bold
                >
                  {messages.Checkout.Congratulations}
                </Text>
                <Text bold>{messages.Checkout.PolicyIssued}</Text>
                <Text
                  css={[
                    utils.fullWidth,
                    utils.my(5),
                    utils.justifyContent("center"),
                    utils.pa(3),
                    utils.background("#f5f7f8"),
                  ]}
                  size="2em"
                  bold
                >
                  {policy?.BasicPolicy[0].PolicyNumber}
                </Text>
                <Text
                  css={[utils.fullWidth, utils.mb(5)]}
                  textAlign="center"
                  bold
                >
                  {messages.Checkout.IssueFollowup}
                </Text>
              </div>
            ) : (
              <Fragment>
                <FormGroup
                  bold
                  label={messages.Checkout.PaymentFrequency}
                  css={utils.ma(5)}
                >
                  <div css={[styles.formRow]}>
                    <Switch
                      options={[
                        {
                          label: messages.Checkout.FullPay,
                          value: PaymentOptions.PaymentFrequency.full,
                        },
                        {
                          label: messages.Checkout.Monthly,
                          value: PaymentOptions.PaymentFrequency.monthly,
                        },
                      ]}
                      value={paymentFrequency}
                      onChange={(value) => {
                        setPaymentFrequency(value);
                      }}
                    />
                    {paymentFrequency ===
                      PaymentOptions.PaymentFrequency.full && (
                      <div css={[styles.paymentInformation.description]}>
                        <div>
                          <Text color={theme.color.primary}>
                            $
                            {(
                              parseFloat(quoteDetail.planDetails.fullPrice) +
                              parseFloat(quoteDetail.planDetails.writtenFeeAmt)
                            ).toFixed(2)}
                          </Text>
                          <Text css={utils.ml(3)}>
                            {messages.Checkout.Today}
                          </Text>
                        </div>
                        <div css={[utils.mb(4), utils.textAlign("right")]}>
                          <Text size="0.9em" bold>
                            {`Includes a $${quoteDetail.planDetails.writtenFeeAmt} of policy fee`}
                          </Text>
                        </div>
                      </div>
                    )}
                    {paymentFrequency ===
                      PaymentOptions.PaymentFrequency.monthly && (
                      <div css={[styles.paymentInformation.description]}>
                        <div css={utils.mb(4)}>
                          <Text
                            color={theme.color.primary}
                          >{`$${quoteDetail.planDetails.downPayment}`}</Text>
                          <Text css={utils.ml(3)}>
                            {messages.Checkout.Today}
                          </Text>
                          <Text css={utils.ml(4)} bold>
                            {messages.Checkout.Convenient}
                          </Text>
                        </div>

                        <div css={[utils.mb(4), utils.textAlign("right")]}>
                          <Text size="0.9em">
                            {messages.Checkout.MonthlyDescription(
                              quoteDetail.planDetails.paymentSchedule.length -
                                1,
                              quoteDetail.planDetails.paymentSchedule[1]
                                .BillAmt,
                              amountToPay
                            )}
                          </Text>
                          <Text size="0.9em" bold>
                            {messages.Checkout.InstallmentFee(
                              quoteDetail.planDetails.installmentFee
                            )}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </FormGroup>
                {/* PAYMENT METHOD */}
                <div css={[utils.mx(5), utils.mb(3)]}>
                  <Text bold> {messages.Checkout.PaymentMethod} </Text>
                </div>
                {reducedPaymentMethodInfo != null ? (
                  <div css={utils.ma(5)}>
                    {reducedPaymentMethodInfo.paymentCategory ===
                      "CreditCard" ||
                      (reducedPaymentMethodInfo.paymentCategory ===
                        "Credit Card" && (
                        <div css={utils.mt(1)}>
                          <Text size="1.2em">
                            <FontAwesomeIcon
                              css={[utils.ml(3), utils.mr(1)]}
                              icon={faCreditCard}
                            />
                            <Text
                              css={utils.mr(1)}
                            >{`${reducedPaymentMethodInfo.cardType} `}</Text>
                            <Text>{`ending in ${reducedPaymentMethodInfo.lastFourDigits}`}</Text>
                            <Text size="0.7em">
                              <FontAwesomeIcon
                                onClick={() => {
                                  formik.validateForm().then(() => {
                                    formik.submitForm();
                                  });
                                }}
                                css={[utils.mx(3), styles.iconCustom]}
                                icon={faPencilAlt}
                              />
                            </Text>
                          </Text>
                        </div>
                      ))}
                    {reducedPaymentMethodInfo.paymentCategory === "ECheck" ||
                      (reducedPaymentMethodInfo.paymentCategory === "ACH" && (
                        <div css={utils.mt(1)}>
                          <Text size="1.2em">
                            <FontAwesomeIcon
                              css={[utils.ml(3), utils.mr(1)]}
                              icon={faUniversity}
                            />
                            <Text
                              css={utils.mr(1)}
                            >{`${reducedPaymentMethodInfo.bankName} `}</Text>
                            <Text
                              css={utils.mr(1)}
                            >{`${reducedPaymentMethodInfo.accountType}`}</Text>
                            <Text>{`ending in ${reducedPaymentMethodInfo.lastFourDigits}`}</Text>
                            <Text size="0.7em">
                              <FontAwesomeIcon
                                onClick={() => {
                                  formik.validateForm().then(() => {
                                    formik.submitForm();
                                  });
                                }}
                                css={[utils.mx(3), styles.iconCustom]}
                                icon={faPencilAlt}
                              />
                            </Text>
                          </Text>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div css={utils.mx(5)}>
                    <Button
                      onClick={() => {
                        formik.validateForm().then(() => {
                          formik.submitForm();
                        });
                      }}
                    >
                      {messages.Checkout.AddPaymentMethod}
                    </Button>
                  </div>
                )}

                <Hr />

                <div css={[utils.centerAlign, utils.fullWidth, utils.pa(4)]}>
                  <Button
                    type="button"
                    disabled={diableIssuePolicy()}
                    onClick={() =>
                      handleIssuePolicy(paymentFrequency, amountToPay)
                    }
                  >
                    {/*Pay And Issue Policy*/}
                    {messages.Checkout.PayAndIssuePolicy}
                  </Button>
                </div>
              </Fragment>
            )}
          </div>
        </Container>

        <div id="portalOneContainer"></div>
      </div>
      <UserInfoModal
        isOpen={userInfoVisible}
        communicationInfo={quoteDetail.communicationInfo}
        onCloseModal={() => setUserInfoVisible(false)}
        onUpdate={(communicationInfo: CommunicationInfo) => {
          processExternalApplicationCloseOut({
            ...quoteDetail,
            communicationInfo: communicationInfo,
          });
        }}
      />
    </Screen>
  );
};
interface UserInput {
  billingInformation: UserAddressInput;
  communicationInformation: {
    email: string;
    phone: string;
  };
  // agreement: boolean
  paymentFrequency: string;
  paymentMethod: string;
}

const getSchema = (messages) =>
  Yup.object().shape({
    billingInformation: Yup.object().shape({
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
    }),
    communicationInformation: Yup.object({
      email: Yup.string()
        .email(messages.Common.Errors.InvalidEmailAddress)
        .required(messages.Common.Errors.RequireEmailAddress),
      phone: Yup.string()
        .matches(
          /^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})( x\d{4})?$/gm,
          messages.Common.Errors.InvalidPhoneNumber
        )
        .required(messages.Common.Errors.RequirePhoneNumber),
    }),
  });

(CheckoutPage as any).Guard = AuthGuard;
(CheckoutPage as any).Layout = QuoteLayout;

export default CheckoutPage;
