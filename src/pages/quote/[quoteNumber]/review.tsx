import {
  Fragment,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

import {
  Text,
  Container,
  Row,
  Col,
  Screen,
  Button,
  FormikInput,
} from "~/components";
import {
  RequiredInformationModal,
  PriorIncidentsModal,
} from "~/screens/modals";
import { utils, theme } from "~/styles";
import { useLocale, useQuote, useError, useAuth } from "~/hooks";
import { AdditionalInterestInfo, LossHistoryInfo, QuoteDetail } from "~/types";

import {
  CarCovered,
  ReviewItem,
  UWQuestions,
} from "~/screens/pages/customize/components";
import { styles } from "~/screens/pages/customize/styles";
import { AdditionalInterestModal } from "~/screens/modals/additional-interest";
import { LossHistoryModal } from "~/screens/modals/loss-history/single-quote";
import { ErrorBox } from "~/components/error-box";
import { questions } from "~/utils/configuration/questions";
import { FormikProvider, useFormik } from "formik";

import * as Yup from "yup";
import { useRouter } from "next/router";
import { AuthGuard } from "~/screens/guards";
import { QuoteLayout } from "~/screens/layouts";

const ReviewCoveragesPage: FunctionComponent = () => {
  const router = useRouter();
  const { messages } = useLocale();
  const quoteNumber = router.query.quoteNumber as string;
  const { quoteDetail, updateQuote, externalApplicationCloseOut, shareQuote } =
    useQuote();
  const { user } = useAuth();
  const { setError } = useError();

  const [selectedTab, selectTab] = useState(1);
  const [requiredInformationModalVisible, setRequiredInformationModalVisible] =
    useState({ required: false, from: null });
  const [priorIncidentsVisible, setPriorIncidentsVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [userInfoRequired, setUserInfoVisible] = useState(false);

  // DEV Notes: For automatic process when the continue to checkout is clicked, but there are some required fields. Need to find a better solution here!!!
  const [hasProceedToCheckout, setProceedToCheckout] = useState(0);

  const [additionalInterestRequired, setAdditionalInterestVisible] =
    useState(false);
  const [lossHistoryRequired, setLossHistoryVisible] = useState(false);

  const schema = () =>
    Yup.object<any>().shape({
      email: Yup.string()
        .email(messages.Common.Errors.InvalidEmailAddress)
        .required(messages.Common.Errors.RequireEmailAddress),
    });

  const formik = useFormik<any>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    initialValues: {
      email: quoteDetail.communicationInfo.email,
    },
    onSubmit: (value) => {
      setLoading(true);
      shareQuote(quoteDetail.systemId, value.email)
        .then((result) => {})
        .catch((e) => {})
        .finally(() => setLoading(false));
    },
  });

  const requiredItemsLabel = useMemo(() => {
    return [
      ...quoteDetail.vehicles
        .filter(
          (v) =>
            v.status === "Active" &&
            (v.vinNumber === undefined ||
              v.odometerReading === undefined ||
              v.readingDate === undefined)
        )
        .map(
          (info) =>
            `${[
              info.vinNumber ? undefined : "Vin Number",
              info.odometerReading && info.readingDate ? undefined : "Odometer",
            ]
              .filter((v) => !!v)
              .join(",")} - ${info.model}`
        ),
      ...quoteDetail.drivers
        .filter((v) => v.status === "Active" && v.licenseNumber === "")
        .map(
          (info) => `${info.firstName} - ${messages.DriverModal.LicenseNumber}`
        ),
    ];
  }, [quoteDetail]);

  const processUpdateQuote = useCallback((updatedQuote: QuoteDetail) => {
    setLoading(true);
    updateQuote(updatedQuote)
      .then(() => {})
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const onContinueToCheckout = useCallback(
    (from?: string) => {
      if (requiredItemsLabel.length > 0) {
        setProceedToCheckout(1);
        setRequiredInformationModalVisible({
          required: true,
          from: "mainFlow",
        });
      } else {
        setLoading(true);
        externalApplicationCloseOut(quoteDetail)
          .then(() => {
            setLoading(false);
            router.push(`/quote/${quoteNumber}/checkout`);
          })
          .catch((e) => {
            setError(e);
          });
      }
    },
    [quoteDetail]
  );

  const processExternalApplicationCloseOut = useCallback(
    (updatedQuote: QuoteDetail) => {
      setLoading(true);
      externalApplicationCloseOut(updatedQuote)
        .then(() => {
          setLoading(false);
        })
        .catch((e) => {
          setError(e);
        });
    },
    []
  );

  useEffect(() => {
    (window as any).ga && (window as any).ga("send", "Review Page View");
  }, []);

  return (
    <Screen
      title={`${quoteNumber} | ${messages.MainTitle}`}
      greyBackground
      breadCrumb={[
        { link: "/quote", label: "Home" },
        { link: `/quote/${quoteNumber}/customize`, label: "Customize" },
        { label: "Review Coverages" },
      ]}
      loading={isLoading}
      css={[utils.flex(1), utils.flexDirection("column")]}
      quoteNumber={quoteNumber}
      systemId={quoteDetail.systemId}
    >
      {/* Mobile Tabs */}
      <Container
        css={[utils.fullWidth, utils.visibleOnMobile, utils.ma(0), utils.pa(0)]}
      >
        <Row css={utils.flexWrap("nowrap")}>
          <Col
            css={[styles.tabSelector, selectedTab === 1 && styles.selectedTab]}
            onClick={() => selectTab(1)}
          >
            <img height="12px" src="/assets/icons/car1.png" css={utils.mr(1)} />
            <Text bold>{messages.Common.Policy}</Text>
          </Col>
          <Col
            css={[styles.tabSelector, selectedTab === 2 && styles.selectedTab]}
            onClick={() => selectTab(2)}
          >
            <img height="12px" src="/assets/icons/car2.png" css={utils.mr(1)} />
            <Text bold>{messages.Common.Cars}</Text>
          </Col>
          <Col
            css={[styles.tabSelector, selectedTab === 3 && styles.selectedTab]}
            onClick={() => selectTab(3)}
          >
            <img
              height="12px"
              src="/assets/icons/steering.png"
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Drivers}</Text>
          </Col>
          <Col
            css={[styles.tabSelector, selectedTab === 4 && styles.selectedTab]}
            onClick={() => selectTab(4)}
          >
            <img height="12px" src="/assets/icons/car1.png" css={utils.mr(1)} />
            <Text bold>{messages.Common.RequiredItems}</Text>
          </Col>
        </Row>
      </Container>

      <Container
        css={[
          utils.fullWidth,
          utils.visibleOnMobile,
          utils.centerAlign,
          utils.flexDirection("column"),
          utils.px(0),
        ]}
      >
        <Text>{quoteNumber}</Text>
        {quoteDetail.validationError && quoteDetail.validationError.length > 0 && (
          <div
            data-testid="error-box-mobile"
            css={[
              utils.fullWidth,
              utils.visibleOnMobile,
              utils.my(3),
              utils.pa(0),
            ]}
          >
            <ErrorBox
              isQuote={quoteDetail.planDetails.isQuote}
              data={quoteDetail.validationError}
              systemId={quoteDetail.systemId}
            />
          </div>
        )}
      </Container>

      <Container wide css={[utils.mt("10px"), utils.hideOnMobile]}>
        <Text size="2.5em" bold>
          {messages.ReviewCoverages.Title}
        </Text>
      </Container>

      {quoteDetail.validationError && quoteDetail.validationError.length > 0 && (
        <div
          data-testid="error-box-mobile"
          css={[utils.fullWidth, utils.hideOnMobile, utils.my(3)]}
        >
          <ErrorBox
            isQuote={quoteDetail.planDetails.isQuote}
            data={quoteDetail.validationError}
            systemId={quoteDetail.systemId}
          />
        </div>
      )}

      <Container wide css={[utils.my("20px"), utils.visibleOnMobile]}>
        <Text
          size="2.5em"
          bold
          textAlign="center"
          css={utils.fullWidth}
          color={theme.color.primary}
        >
          {messages.ReviewCoverages.MobileTitle}
        </Text>
      </Container>

      <Container wide css={utils.hideOnMobile}>
        <Row css={utils.fullWidth}>
          <Col md={12} lg={9}>
            {/* auto policy */}
            <div css={[styles.whiteBackground, styles.autoPolicy]}>
              <Text size="2.5em" bold css={utils.mb(7)}>
                <img src="/assets/icons/car1.png" css={utils.mr(1)} />
                {messages.ReviewCoverages.AutoPolicy}
              </Text>

              {/* Drivers Covered */}
              <div>
                <Text size="2em" bold css={utils.mb(5)}>
                  {messages.ReviewCoverages.DriversCovered}
                </Text>

                <Row>
                  <Col>
                    {quoteDetail.drivers
                      .filter((driver) => driver.status === "Active")
                      .map((driver, key) => (
                        <div css={styles.infoItem} key={key}>
                          <Text bold>
                            {driver.firstName} {driver.lastName}
                          </Text>
                          <Text size="1.25em" bold>
                            {driver.age} Years
                          </Text>
                        </div>
                      ))}

                    <div css={styles.infoItem}></div>
                  </Col>

                  <Col>
                    <div css={[styles.infoItem, utils.height("4.5em")]}>
                      <Text bold>
                        {messages.ReviewCoverages.TotalTermPrice}
                      </Text>
                      <Text size="2em" bold>
                        {}$
                        {Math.round(
                          +quoteDetail.planDetails.fullPrice
                        ).toString()}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>
                        {messages.ReviewCoverages.PolicyTermPrice}
                      </Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planDetails.renewalTerm}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Limits */}
              <div>
                <Text size="2em" bold css={utils.my(5)}>
                  {messages.ReviewCoverages.Limits}
                </Text>

                <Row>
                  <Col xs={7}>
                    <div css={styles.infoItem}>
                      <Text bold>{messages.ReviewCoverages.BodilyInjury}</Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planDetails.bodilyInjuryLimit
                          .split("/")
                          .map((str) => `$${str}`)
                          .join("/")}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>
                        {messages.ReviewCoverages.UninsuredMotorist}
                      </Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planDetails.uninsuredMotoristLimit
                          .split("/")
                          .map((str) => `$${str}`)
                          .join("/")}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>
                        {
                          messages.ReviewCoverages
                            .UninsuredMotoristPropertyDamage
                        }
                      </Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planDetails.UM_PD_WCD_Applies}
                      </Text>
                    </div>
                  </Col>

                  <Col xs={5}>
                    <div css={styles.infoItem}>
                      <Text bold>
                        {messages.ReviewCoverages.MedicalPayments}
                      </Text>
                      <Text size="1.25em" bold>
                        ${quoteDetail.planDetails.medicalPaymentsLimit}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>
                        {messages.ReviewCoverages.PropertyDamage}
                      </Text>
                      <Text size="1.25em" bold>
                        ${quoteDetail.planDetails.propertyDamage}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Cars Covered */}
            <div css={utils.my(1)}>
              <Text size="2em" bold css={utils.my(4)}>
                {messages.ReviewCoverages.CarsCovered}
              </Text>

              {quoteDetail.planDetails.vehicleInfo
                .filter((vehicle) => vehicle.status === "Active")
                .map((vehicle, key) => (
                  <CarCovered css={utils.mb(5)} vehicle={vehicle} key={key} />
                ))}
            </div>

            {/* UW Questions */}
            <div css={utils.mt("4rem")}>
              <div css={utils.mb(0)}>
                <UWQuestions
                  title={"Underwriting"}
                  configQuestions={questions.autoP1}
                  uwQuestions={quoteDetail.uwQuestions}
                  onAnswerChange={(questionName, answer) => {
                    const i = quoteDetail.uwQuestions.findIndex(
                      (e) => e.Name === questionName
                    );
                    if (quoteDetail.uwQuestions[i].Value != answer) {
                      quoteDetail.uwQuestions[i].Value = answer;
                      processUpdateQuote(quoteDetail);
                    }
                  }}
                />
              </div>

              <div css={utils.pl(5)}>
                <UWQuestions
                  isSubQuestionnaire={true}
                  title={messages.ReviewCoverages.UWQuestionsTitle}
                  configQuestions={questions.autoP2}
                  uwQuestions={quoteDetail.uwQuestions}
                  onAnswerChange={(questionName, answer) => {
                    const i = quoteDetail.uwQuestions.findIndex(
                      (e) => e.Name === questionName
                    );
                    if (quoteDetail.uwQuestions[i].Value != answer) {
                      quoteDetail.uwQuestions[i].Value = answer;
                      processUpdateQuote(quoteDetail);
                    }
                  }}
                />
              </div>
            </div>
          </Col>

          <Col md={12} lg={3}>
            <div css={[styles.whiteBackground, utils.pa(2), utils.fullHeight]}>
              {requiredItemsLabel.length > 0 && (
                <ReviewItem
                  css={utils.mt(5)}
                  header={messages.Customize.RequiredInformation}
                  items={requiredItemsLabel}
                  onEdit={() => {
                    setProceedToCheckout(0);
                    setRequiredInformationModalVisible({
                      required: true,
                      from: null,
                    });
                  }}
                />
              )}

              <ReviewItem
                css={utils.mb(5)}
                header={messages.ReviewCoverages.ShareThisQuote}
              >
                <div
                  css={[
                    utils.display("flex"),
                    utils.flexDirection("column"),
                    utils.alignItems("center"),
                    utils.py(3),
                  ]}
                >
                  <Text css={[utils.fullWidth, utils.my(4)]}>
                    {messages.ReviewCoverages.ShareQuoteDescription}
                  </Text>

                  <FormikProvider value={formik}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                      }}
                      css={[
                        utils.fullWidth,
                        utils.flexDirection("column"),
                        utils.alignItems("center"),
                        utils.display("flex"),
                      ]}
                    >
                      <FormikInput
                        name="email"
                        type="email"
                        css={[utils.fullWidth, utils.mb(3)]}
                        placeholder={messages.Common.EmailAddress}
                      />
                      <Button css={utils.maxWidth("170px")} type="submit">
                        {messages.ReviewCoverages.ShareQuote}
                      </Button>
                    </form>
                  </FormikProvider>
                </div>
              </ReviewItem>

              <ReviewItem
                css={utils.mt(5)}
                header={messages.ReviewCoverages.AgentInformation}
              >
                <Text color={theme.color.primary} bold css={utils.my(3)}>
                  {user &&
                    user.DTOProvider.Contact &&
                    user.DTOProvider.Contact[0].PartyInfo[0].NameInfo[0]
                      .CommercialName}
                </Text>

                <div css={styles.infoItem}>
                  <Text bold>{messages.Common.Agent}</Text>
                  <Text>
                    {user &&
                      user.DTOProvider.Contact &&
                      user.DTOProvider.Contact[0].PartyInfo[0].PersonInfo[0]
                        .PositionTitle}
                  </Text>
                </div>
                <div css={styles.infoItem}>
                  <Text bold>{messages.Common.Phone}</Text>
                  <Text>
                    {user &&
                      user.DTOProvider.Contact &&
                      user.DTOProvider.Contact[0].PartyInfo[0].PhoneInfo.find(
                        (phoneInfo) => phoneInfo.PhoneName === "Business"
                      )?.PhoneNumber}
                  </Text>
                </div>
                <div css={styles.infoItem}>
                  <Text bold>{messages.Common.Email}</Text>
                  <Text>
                    {user &&
                      user.DTOProvider.Contact &&
                      user.DTOProvider.Contact[0].PartyInfo[0].EmailInfo[0]
                        .EmailAddr}
                  </Text>
                </div>
              </ReviewItem>

              <ReviewItem
                css={utils.mt(3)}
                header={messages.AIModal.Title}
                onEdit={() => {
                  setProceedToCheckout(0);
                  setAdditionalInterestVisible(true);
                }}
              />
              <ReviewItem
                css={utils.mt(3)}
                header={"Loss History"}
                onEdit={() => {
                  setLossHistoryVisible(true);
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Container wide css={[utils.visibleOnMobile, utils.flex(1)]}>
        {/* Policy */}
        {selectedTab === 1 && (
          <Fragment>
            <div css={[styles.whiteBackground, utils.pa(3)]}>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.TotalTermPrice}</Text>
                <Text size="2em" bold>
                  {}${Math.round(+quoteDetail.planDetails.fullPrice).toString()}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.PolicyTermPrice}</Text>
                <Text size="1.25em" bold>
                  ${quoteDetail.planDetails.renewalTerm}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.BodilyInjury}</Text>
                <Text size="1.25em" bold>
                  {quoteDetail.planDetails.bodilyInjuryLimit
                    .split("/")
                    .map((str) => `$${str}`)
                    .join("/")}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.UninsuredMotorist}</Text>
                <Text size="1.25em" bold>
                  {quoteDetail.planDetails.uninsuredMotoristLimit
                    .split("/")
                    .map((str) => `$${str}`)
                    .join("/")}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.MedicalPayments}</Text>
                <Text size="1.25em" bold>
                  ${quoteDetail.planDetails.medicalPaymentsLimit}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.PropertyDamage}</Text>
                <Text size="1.25em" bold>
                  ${quoteDetail.planDetails.propertyDamage}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>
                  {messages.ReviewCoverages.UninsuredMotoristPropertyDamage}
                </Text>
                <Text size="1.25em" bold>
                  {quoteDetail.planDetails.UM_PD_WCD_Applies}
                </Text>
              </div>
            </div>
            <ReviewItem
              css={utils.mt(3)}
              header={messages.ReviewCoverages.ShareThisQuote}
            >
              <div
                css={[
                  utils.display("flex"),
                  utils.flexDirection("column"),
                  utils.alignItems("center"),
                ]}
              >
                <Text css={[utils.fullWidth, utils.my(4)]}>
                  {messages.ReviewCoverages.ShareQuoteDescription}
                </Text>
                <FormikProvider value={formik}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      formik.handleSubmit();
                    }}
                    css={[
                      utils.fullWidth,
                      utils.flexDirection("column"),
                      utils.alignItems("center"),
                      utils.display("flex"),
                    ]}
                  >
                    <FormikInput
                      name="email"
                      type="email"
                      css={[utils.fullWidth, utils.mb(3)]}
                      placeholder={messages.Common.EmailAddress}
                    />
                    <Button css={utils.maxWidth("170px")} type="submit">
                      {messages.ReviewCoverages.ShareQuote}
                    </Button>
                  </form>
                </FormikProvider>
              </div>
            </ReviewItem>
          </Fragment>
        )}

        {/* Cars */}
        {selectedTab === 2 && (
          <Fragment>
            {quoteDetail.planDetails.vehicleInfo.map((vehicle, key) => (
              <CarCovered css={utils.mb(5)} vehicle={vehicle} key={key} />
            ))}
          </Fragment>
        )}

        {/* Drivers */}
        {selectedTab === 3 && (
          <div css={[styles.whiteBackground, utils.pa(3)]}>
            {quoteDetail.drivers
              .filter((driver) => driver.status === "Active")
              .map((driver, key) => (
                <div css={styles.infoItem} key={key}>
                  <Text bold>
                    {driver.firstName} {driver.lastName}
                  </Text>
                  <Text size="1.25em" bold>
                    {driver.age} Years
                  </Text>
                </div>
              ))}
          </div>
        )}

        {selectedTab === 4 && (
          <div css={[styles.whiteBackground, utils.pa(3)]}>
            {[
              quoteDetail.vehicles
                .filter(
                  (v) =>
                    v.status === "Active" &&
                    (v.vinNumber === undefined ||
                      v.odometerReading === undefined ||
                      v.readingDate === undefined)
                )
                .map(
                  (info) =>
                    `${[
                      info.vinNumber ? undefined : "Vin Number",
                      info.odometerReading && info.readingDate
                        ? undefined
                        : "Odometer",
                    ]
                      .filter((v) => !!v)
                      .join(",")} - ${info.model}`
                ),
            ].length > 0 && (
              <ReviewItem
                css={utils.mt(3)}
                header={messages.Customize.RequiredInformation}
                items={quoteDetail.vehicles
                  .filter(
                    (v) =>
                      v.status === "Active" &&
                      (v.vinNumber === undefined ||
                        v.odometerReading === undefined ||
                        v.readingDate === undefined)
                  )
                  .map(
                    (info) =>
                      `${[
                        info.vinNumber ? undefined : "Vin Number",
                        info.odometerReading && info.readingDate
                          ? undefined
                          : "Odometer",
                      ]
                        .filter((v) => !!v)
                        .join(",")} - ${info.model}`
                  )}
                onEdit={() =>
                  setRequiredInformationModalVisible({
                    required: true,
                    from: null,
                  })
                }
              />
            )}
            <ReviewItem
              css={utils.mt(3)}
              header={messages.AIModal.Title}
              onEdit={() => {
                setProceedToCheckout(0);
                setAdditionalInterestVisible(true);
              }}
            />
            <ReviewItem
              css={utils.mt(3)}
              header={"Loss History"}
              onEdit={() => {
                setLossHistoryVisible(true);
              }}
            />
          </div>
        )}
      </Container>

      {/* Footer */}
      <div css={[utils.centerAlign, utils.mt(5), utils.pa(3), styles.footer]}>
        <div css={[utils.centerAlign, utils.pa(3)]}>
          {}
          <Text bold size="1.25em">
            <FontAwesomeIcon icon={faCar} css={utils.mr(2)} />
            {}${Math.round(+quoteDetail.planDetails.fullPrice).toString()}
          </Text>
        </div>
        <Button onClick={() => onContinueToCheckout("mainFlow")}>
          {messages.Common.ContinueToCheckout}
        </Button>
      </div>

      {/* Modals */}
      <RequiredInformationModal
        isOpen={requiredInformationModalVisible.required}
        defaultValue={quoteDetail}
        onCloseModal={() =>
          setRequiredInformationModalVisible({ required: false, from: null })
        }
        onUpdate={(v) => {
          setLoading(true);
          setProceedToCheckout(2);

          updateQuote(v)
            .then(() => {
              setLoading(false);
            })
            .catch((e) => {
              setError(e);
            });
        }}
      />

      <PriorIncidentsModal
        isOpen={priorIncidentsVisible}
        onCloseModal={() => setPriorIncidentsVisible(false)}
        onConfirm={() => {
          setPriorIncidentsVisible(false);
          router.push(`/quote/${quoteNumber}/checkout`);
        }}
      />

      {}

      <AdditionalInterestModal
        additionalInterest={quoteDetail.additionalInterest}
        vehicles={quoteDetail.planDetails.vehicleInfo}
        isOpen={additionalInterestRequired}
        onCloseModal={() => setAdditionalInterestVisible(false)}
        onUpdate={(additionalInterestInfo: Array<AdditionalInterestInfo>) => {
          processUpdateQuote({
            ...quoteDetail,
            additionalInterest: additionalInterestInfo,
          });
        }}
      />

      <LossHistoryModal
        isOpen={lossHistoryRequired}
        onCloseModal={() => setLossHistoryVisible(false)}
        lossHistory={quoteDetail.lossHistory}
        onUpdate={(lhInfo: Array<LossHistoryInfo>) => {
          processUpdateQuote({
            ...quoteDetail,
            lossHistory: lhInfo,
          });
        }}
        onAppCloseOut={(lhInfo: Array<LossHistoryInfo>) => {
          processExternalApplicationCloseOut({
            ...quoteDetail,
            lossHistory: lhInfo,
          });
        }}
      />
    </Screen>
  );
};

(ReviewCoveragesPage as any).Guard = AuthGuard;
(ReviewCoveragesPage as any).Layout = QuoteLayout;

export default ReviewCoveragesPage;
