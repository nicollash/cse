import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Fragment,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  Screen,
  Container,
  Text,
  Row,
  Col,
  Button,
} from "~/frontend/components";
import {
  AddVehicleModal,
  EditVehicleModal,
  DeleteVehicleModal,
  EditDriverModal,
  DiscountsModal,
  RequiredInformationModal,
  AutoPolicyModal,
  DeleteDriverModal,
} from "~/frontend/screens/modals";
import { utils } from "~/frontend/styles";
import {
  AdditionalInterestInfo,
  CommunicationInfo,
  CustomError,
  CustomErrorType,
  DefaultDriverInfo,
  DriverPointsInfo,
  EAddressObjectStatus,
  LossHistoryInfo,
  QuoteDetail,
  ValidationError,
} from "~/types";

import { formRedirect } from "~/frontend/utils";

import {
  ItemBlock,
  ListItem,
  ReviewItem,
  PlanItem,
} from "~/frontend/screens/pages/customize/components";
import { styles } from "~/frontend/screens/pages/customize/styles";
import { useError, useLocale, useMobile } from "~/frontend/hooks";
import { AdditionalInterestModal } from "~/frontend/screens/modals/additional-interest";
import { LossHistoryModal } from "~/frontend/screens/modals/loss-history";
import { ErrorBox } from "~/frontend/components/error-box";
import { UserInfoModal } from "~/frontend/screens/modals/user-info";
import { useRouter } from "next/router";
import { getSession } from "~/backend/lib";
import { QuoteService } from "~/backend/services";
import { getNewDriverParam, logger, parseQuoteResponse } from "~/helpers";

const CustomizePage: FunctionComponent<any> = ({
  user,
  lastError,
  quoteDetail: originalQuoteDetail,
  quoteResponse,
  infractionList,
  newRisk,
}) => {
  const { messages } = useLocale();
  const { setError } = useError();
  const router = useRouter();
  const quoteNumber = router.query.quoteNumber as string;

  const { mobileView } = useMobile();

  // modal visibilities
  const [addCarVisible, setAddCarVisible] = useState(!!newRisk);
  const [editCarIndex, setEditCarIndex] = useState(null);
  const [deleteCarIndex, setDeleteCarIndex] = useState(null);
  const [editDriverIndex, setEditDriverIndex] = useState(null);
  const [deleteDriverIndex, setDeleteDriverIndex] = useState(null);
  const [discountsModalVisible, setDiscountsModalVisible] = useState(false);
  const [requiredInformationModalVisible, setRequiredInformationModalVisible] =
    useState({ required: false, from: null });
  const [autoPolicyModalVisible, setAutoPolicyModalVisible] = useState(false);
  const [selectedTab, selectTab] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [reviewableItems, setReviewableItems] = useState([]);

  const [quoteDetail, setQuoteDetail] = useState(originalQuoteDetail);

  const [isLoading, setLoading] = useState(false);

  const [additionalInterestRequired, setAdditionalInterestVisible] =
    useState(false);
  const [lossHistoryRequired, setLossHistoryVisible] = useState(false);

  const [userInfoRequired, setUserInfoVisible] = useState(false);

  if (lastError && lastError !== "null") {
    setError(lastError);
  }

  const updateQuoteDetail = useCallback(
    (newData) => setQuoteDetail((qD) => ({ ...qD, ...newData })),
    []
  );

  const updateQuote = useCallback((quoteData, redirectURL?) => {
    formRedirect("/action/quote/update", {
      form: JSON.stringify({
        quoteResponse,
        quoteDetail: quoteData,
        redirectURL,
      }),
    });
  }, []);

  const convertToApplication = useCallback((quoteData) => {
    formRedirect("/action/quote/convertToApplication", {
      form: JSON.stringify({
        quoteResponse,
        quoteDetail: quoteData,
        redirectURL: `/quote/${quoteNumber}/review`,
      }),
    });
  }, []);

  const calcRequiredItemsLabel = useCallback((qD: QuoteDetail) => {
    return qD
      ? [
          ...qD.vehicles
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
          ...qD.drivers
            .filter((v) => v.status === "Active" && v.licenseNumber === "")
            .map(
              (info) =>
                `${info.firstName} - ${messages.DriverModal.LicenseNumber}`
            ),
        ]
      : [];
  }, []);
  const requiredItemsLabel = useMemo(() => {
    return calcRequiredItemsLabel(quoteDetail);
  }, [quoteDetail]);

  const getAssignedDriverName = useCallback(
    (vehicle) => {
      const primaryDriverRef = quoteDetail.vehicles.find(
        (v) =>
          v.vinNumber === vehicle.vinNumber || v.vehNumber === vehicle.vehNumber
      );
      const driver = quoteDetail.drivers.find(
        (driver) => driver.id === primaryDriverRef?.primaryDriver
      );
      return driver ? `${driver.firstName} ${driver.lastName}` : "";
    },
    [quoteDetail]
  );

  const processCheckout = useCallback(() => {
    if (quoteDetail.planDetails.isQuote) {
      if (requiredItemsLabel.length > 0) {
        setRequiredInformationModalVisible({
          from: "checkout",
          required: true,
        });
      } else {
        setUserInfoVisible(true);
      }
    } else {
      formRedirect(`/quote/${quoteNumber}/review`);
    }
  }, [quoteDetail]);

  const processUpdateDriverPoints = useCallback(
    (
      action: string,
      driverNumber: string,
      newDriverPoints: DriverPointsInfo
    ) => {
      setLoading(true);
      formRedirect("/action/quote/UpdateDriverPoints", {
        form: JSON.stringify({
          action,
          driverNumber,
          newDriverPoints,
          quoteResponse,
          redirectURL: `/quote/${quoteNumber}/customize`,
        }),
      });
    },
    []
  );

  const processExternalApplicationCloseOut = useCallback(
    (newQuote: QuoteDetail) => {
      setLoading(true);
      formRedirect("/action/quote/ExternalApplicationCloseOut", {
        form: JSON.stringify({
          newQuote,
          quoteResponse,
          redirectURL: `/quote/${quoteNumber}/customize`,
        }),
      });
    },
    []
  );

  // effects
  useEffect(() => {
    (window as any).ga && (window as any).ga("send", "Customize Page View");

    if (quoteDetail) {
      setReviewableItems([
        ...quoteDetail.vehicles
          .filter((vehicle) => vehicle.status === "Active")
          .map((vehicle) => vehicle.id),
        ...quoteDetail.drivers
          .filter((driver) => driver.status === "Active")
          .map((driver) => driver.id),
      ]);
    }
  }, []);

  return (
    <Screen
      title={`${quoteNumber} | ${messages.MainTitle}`}
      greyBackground
      breadCrumb={[{ link: "/quote", label: "Home" }, { label: "Customize" }]}
      css={[utils.flex(1), utils.flexDirection("column")]}
      loading={isLoading}
      quoteNumber={quoteNumber}
      conversationId={user.ResponseParams[0].ConversationId}
      systemId={quoteDetail?.systemId}
      user={user}
      lastError={lastError && JSON.parse(lastError)}
    >
      {quoteDetail && (
        <Fragment>
          {/* Tabs - Car/Auto for now */}
          <Container
            wide
            css={[
              utils.display("flex"),
              utils.alignItems("flex-start"),
              //utils.mt('60px'),
              utils.hideOnMobile,
            ]}
          >
            {/* Header */}
            <div css={[styles.tab, styles.activeTab]}>
              <Text size="2.5em" bold>
                <img src="/assets/icons/car1.png" css={utils.mr(1)} />
                {messages.Common.Car}
              </Text>
            </div>
          </Container>

          {/* Mobile Tabs */}
          <Container
            css={[utils.fullWidth, utils.visibleOnMobile, utils.pa(0)]}
          >
            <Row css={utils.flexWrap("nowrap")}>
              <Col
                data-testid="mobile-tab-policy"
                css={[
                  styles.tabSelector,
                  selectedTab === 1 && styles.selectedTab,
                ]}
                onClick={() => selectTab(1)}
              >
                <img
                  height="12px"
                  src="/assets/icons/car1.png"
                  css={utils.mr(1)}
                />
                <Text bold>{messages.Common.Policy}</Text>
              </Col>
              <Col
                data-testid="mobile-tab-cars"
                css={[
                  styles.tabSelector,
                  selectedTab === 2 && styles.selectedTab,
                ]}
                onClick={() => selectTab(2)}
              >
                <img
                  height="12px"
                  src="/assets/icons/car2.png"
                  css={utils.mr(1)}
                />
                <Text bold>{messages.Common.Cars}</Text>
              </Col>
              <Col
                data-testid="mobile-tab-drivers"
                css={[
                  styles.tabSelector,
                  selectedTab === 3 && styles.selectedTab,
                ]}
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
                data-testid="mobile-tab-reviewItems"
                css={[
                  styles.tabSelector,
                  selectedTab === 4 && styles.selectedTab,
                ]}
                onClick={() => selectTab(4)}
              >
                <img
                  height="12px"
                  src="/assets/icons/car1.png"
                  css={utils.mr(1)}
                />
                <Text bold>{messages.Common.ReviewItems}</Text>
              </Col>
            </Row>
          </Container>

          <Container
            data-testid="text-quotenumber"
            css={[
              utils.fullWidth,
              utils.visibleOnMobile,
              utils.my(3),
              utils.centerAlign,
            ]}
          >
            <Text>{quoteNumber}</Text>
          </Container>

          {quoteDetail?.validationError &&
            quoteDetail.validationError.length > 0 && (
              <div
                data-testid="error-box-mobile"
                css={[utils.fullWidth, utils.visibleOnMobile, utils.my(3)]}
              >
                <ErrorBox
                  conversationId={user.ResponseParams[0].ConversationId}
                  data={quoteDetail.validationError}
                  systemId={quoteDetail.systemId}
                  isQuote={quoteDetail.planDetails.isQuote}
                  actions={[
                    {
                      //Rated mileage on Veh
                      text: "View",
                      contains: "Rated mileage on Veh#",
                      action: (e: ValidationError) => {
                        const sT = e.Msg.substring(
                          e.Msg.lastIndexOf("#") + 1,
                          e.Msg.indexOf(" has")
                        ).trim();
                        logger(`editing vehicle: ${sT}`);
                        setEditCarIndex(parseInt(sT) - 1);
                      },
                    },
                  ]}
                />
              </div>
            )}

          {/* Items */}
          <div
            css={[
              styles.whiteBackground,
              utils.py("16px"),
              selectedTab === 1 && utils.hideOnMobile,
            ]}
          >
            {quoteDetail?.validationError &&
              quoteDetail.validationError.length > 0 && (
                <div css={[utils.fullWidth, utils.mx("auto")]}>
                  <div css={[utils.mb(3), utils.hideOnMobile]}>
                    <ErrorBox
                      conversationId={user.ResponseParams[0].ConversationId}
                      css={utils.maxWidth("65%")}
                      cp={true}
                      data={quoteDetail.validationError}
                      systemId={quoteDetail.systemId}
                      isQuote={quoteDetail.planDetails.isQuote}
                      actions={[
                        {
                          //Rated mileage on Veh
                          text: "View",
                          contains: "Rated mileage on Veh#",
                          action: (e: ValidationError) => {
                            const sT = e.Msg.substring(
                              e.Msg.lastIndexOf("#") + 1,
                              e.Msg.indexOf(" has")
                            ).trim();
                            logger(`editing vehicle: ${sT}`);
                            setEditCarIndex(parseInt(sT) - 1);
                          },
                        },
                      ]}
                    />
                  </div>
                </div>
              )}

            <Container wide css={utils.display("flex")}>
              <Row css={[utils.fullWidth, styles.row]}>
                <Col
                  css={[selectedTab !== 2 && utils.hideOnMobile]}
                  xl={3}
                  lg={3}
                  md={12}
                >
                  <ItemBlock
                    data-testid="block-vehicles"
                    icon="/assets/icons/car2.png"
                    headerText={messages.Common.Cars}
                  >
                    {quoteDetail.vehicles.map(
                      (vehicle, key) =>
                        vehicle.status === "Active" && (
                          <ListItem
                            data-testid={`vehicle-${key}`}
                            key={key}
                            text={vehicle.model}
                            onEdit={() => setEditCarIndex(key)}
                            onDelete={() => setDeleteCarIndex(key)}
                          />
                        )
                    )}

                    <Button
                      data-testid="button-add-vehicle"
                      width="120px"
                      css={utils.mt(5)}
                      onClick={() => setAddCarVisible(true)}
                    >
                      <Text color="white">
                        <FontAwesomeIcon icon={faPlus} css={utils.mr(2)} />
                        {messages.Customize.Add}
                      </Text>
                    </Button>
                  </ItemBlock>
                </Col>

                <Col
                  css={[selectedTab !== 3 && utils.hideOnMobile]}
                  xl={3}
                  lg={3}
                  md={12}
                >
                  <ItemBlock
                    data-testid="block-drivers"
                    icon="/assets/icons/steering.png"
                    headerText={messages.Common.Drivers}
                  >
                    {quoteDetail.drivers.map(
                      (driver, key) =>
                        driver.status === "Active" && (
                          <ListItem
                            data-testid={`driver-${key}`}
                            text={`${driver.firstName} ${driver.lastName}`}
                            key={key}
                            onEdit={() => setEditDriverIndex(key)}
                            onDelete={() => setDeleteDriverIndex(key)}
                          />
                        )
                    )}
                    <Button
                      data-testid="button-add-driver"
                      width="120px"
                      css={utils.mt(5)}
                      onClick={() => setEditDriverIndex("new")}
                    >
                      <Text color="white">
                        <FontAwesomeIcon icon={faPlus} css={utils.mr(2)} />
                        {messages.Customize.Add}
                      </Text>
                    </Button>
                  </ItemBlock>
                </Col>

                <Col
                  css={[selectedTab !== 3 && utils.hideOnMobile]}
                  xl={3}
                  lg={3}
                  md={12}
                >
                  <PlanItem
                    data-testid={"Standard"}
                    planInfo={quoteDetail.planDetails}
                    onCustomize={() => setAutoPolicyModalVisible(true)}
                    onSelect={() => {}}
                    selected={true}
                    showDetail={showDetail}
                    toggleDetails={() => setShowDetail((state) => !state)}
                    onUpdatePlanInfo={(updatedPlanInfo) => {
                      updateQuoteDetail({
                        planDetails: updatedPlanInfo,
                      });
                    }}
                    onContinueToCheckout={() => {
                      processCheckout();
                    }}
                    changeEffectiveDate={(e) => {
                      setLoading(true);
                      updateQuote(
                        {
                          ...quoteDetail,
                          planDetails: {
                            ...quoteDetail.planDetails,
                            effectiveDate: e,
                          },
                        },
                        `/quote/${quoteNumber}/customize`
                      );
                    }}
                  />
                </Col>

                <Col
                  css={[selectedTab !== 4 && utils.hideOnMobile]}
                  xl={3}
                  lg={3}
                  md={12}
                >
                  <ItemBlock
                    data-testid="block-review-items"
                    icon="/assets/icons/car1.png"
                    headerText={messages.Common.ReviewItems}
                  >
                    {quoteDetail.vehicles.map(
                      (vehicle, key) =>
                        reviewableItems.includes(vehicle.id) &&
                        vehicle.status === "Active" && (
                          <ListItem
                            data-testid={`review-item-${vehicle.id}`}
                            key={key}
                            text={vehicle.model}
                            onEdit={() => setEditCarIndex(key)}
                          />
                        )
                    )}
                    {quoteDetail.drivers.map(
                      (driver, key) =>
                        reviewableItems.includes(driver.id) &&
                        driver.status === "Active" && (
                          <ListItem
                            data-testid={`review-item-${driver.id}`}
                            text={`${driver.firstName} ${driver.lastName}`}
                            key={key}
                            onEdit={() => setEditDriverIndex(key)}
                          />
                        )
                    )}
                    <ReviewItem
                      data-testid="review-item-discount"
                      css={utils.mt(3)}
                      header={messages.Customize.AppliedDiscounts}
                      items={quoteDetail.discounts
                        .filter((discount) => discount.applied === "Yes")
                        .map((discount) => discount.description)}
                      onEdit={() => setDiscountsModalVisible(true)}
                    />
                    {requiredItemsLabel.length > 0 && (
                      <ReviewItem
                        data-testid="review-item-required"
                        css={utils.mt(3)}
                        header={messages.Customize.RequiredInformation}
                        items={requiredItemsLabel}
                        onEdit={() =>
                          setRequiredInformationModalVisible({
                            required: true,
                            from: "review-item",
                          })
                        }
                      />
                    )}
                    <ReviewItem
                      css={utils.mt(3)}
                      header={messages.AIModal.Title}
                      onEdit={() => {
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
                  </ItemBlock>
                </Col>
              </Row>
            </Container>
          </div>

          {/* Plan */}
          {!quoteDetail.infoReq && mobileView ? (
            <Container
              wide
              css={[utils.flex(1), selectedTab !== 1 && utils.hideOnMobile]}
            >
              <Row css={[utils.fullWidth, utils.ma(0)]}>
                <Col xl={12} lg={12}>
                  <Row
                    css={[
                      utils.display("flex"),
                      utils.justifyContent("center"),
                      utils.alignItems("center"),
                      styles.row,
                    ]}
                  >
                    <Col
                      css={[styles.col, !mobileView && utils.maxWidth("60%")]}
                      key={"Standard"}
                      xl={8}
                      lg={12}
                    >
                      <PlanItem
                        data-testid={"Standard"}
                        planInfo={quoteDetail.planDetails}
                        onCustomize={() => setAutoPolicyModalVisible(true)}
                        onSelect={() => {}}
                        selected={true}
                        showDetail={showDetail}
                        toggleDetails={() => setShowDetail((state) => !state)}
                        onUpdatePlanInfo={(updatedPlanInfo) => {
                          updateQuoteDetail({
                            planDetails: updatedPlanInfo,
                          });
                        }}
                        onContinueToCheckout={() => {
                          processCheckout();
                        }}
                        changeEffectiveDate={(e) => {
                          setLoading(true);
                          updateQuote(
                            {
                              ...quoteDetail,
                              planDetails: {
                                ...quoteDetail.planDetails,
                                effectiveDate: e,
                              },
                            },
                            `/quote/${quoteNumber}/customize`
                          );
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          ) : null}

          {/* Details */}
          {showDetail && (
            <div
              css={[styles.whiteBackground, utils.py("16px"), utils.my("16px")]}
            >
              <Container wide>
                {quoteDetail.planDetails.vehicleInfo
                  .filter((vehicle) => vehicle.status === "Active")
                  .map((vehicle, key) => (
                    <Row key={key} css={[utils.fullWidth, utils.my("20px")]}>
                      <Col>
                        <table css={[utils.fullWidth, styles.table]}>
                          <caption>
                            <div
                              css={[
                                utils.display("flex"),
                                utils.justifyContent("space-between"),
                                utils.alignItems("center"),
                              ]}
                            >
                              <Text bold size="1.5em">
                                {vehicle.model} - {vehicle.vinNumber}
                              </Text>
                              <Text bold size="1.5em">
                                {`${
                                  messages.Customize.AssignedDriver
                                }: ${getAssignedDriverName(vehicle)}`}
                              </Text>
                            </div>
                          </caption>
                          <colgroup>
                            <col width="50%" />
                            <col width="25%" />
                            <col width="25%" />
                          </colgroup>
                          <tbody>
                            {vehicle.coverages.map((coverage, key1) => (
                              <tr key={key1}>
                                <td>{coverage.description}</td>
                                <td>
                                  <Text
                                    css={utils.fullWidth}
                                    bold
                                    textAlign="right"
                                  ></Text>
                                </td>
                                <td>
                                  <Text
                                    css={utils.fullWidth}
                                    bold
                                    textAlign="right"
                                  >
                                    $ {coverage.amount}
                                  </Text>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  ))}
                <Row css={[utils.fullWidth, utils.my("20px")]}>
                  <Col>
                    <table css={[utils.fullWidth, styles.table]}>
                      <caption>
                        <div
                          css={[
                            utils.display("flex"),
                            utils.justifyContent("space-between"),
                            utils.alignItems("center"),
                          ]}
                        >
                          <Text bold size="1.5em">
                            {`${messages.Customize.AdditionalPremiumCredits}`}
                          </Text>
                          <Text bold size="1.5em"></Text>
                        </div>
                      </caption>
                      <colgroup>
                        <col width="50%" />
                        <col width="25%" />
                        <col width="25%" />
                      </colgroup>
                      <tbody>
                        {quoteDetail.planDetails.fees.map((fee, key) => (
                          <tr key={key}>
                            <td>{fee.description}</td>
                            <td>
                              <Text
                                css={utils.fullWidth}
                                bold
                                textAlign="right"
                              ></Text>
                            </td>
                            <td>
                              <Text
                                css={utils.fullWidth}
                                bold
                                textAlign="right"
                              >
                                $ {fee.amount}
                              </Text>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Container>
            </div>
          )}

          {/* Footer */}
          {!quoteDetail.infoReq ? (
            <div
              css={[utils.centerAlign, utils.mt(5), utils.pa(3), styles.footer]}
            >
              <div css={[utils.centerAlign, utils.pa(3)]}>
                <Text bold size="1.25em">
                  <FontAwesomeIcon icon={faCar} css={utils.mr(2)} />$
                  {quoteDetail.planDetails.paymentPlan === "monthly"
                    ? quoteDetail.planDetails.monthlyPrice
                    : Math.round(+quoteDetail.planDetails.fullPrice).toString()}
                </Text>
              </div>
              <Button
                onClick={() => {
                  processCheckout();
                }}
              >
                {messages.Common.ContinueToReview}
              </Button>
            </div>
          ) : null}

          {/* Modals */}
          <AddVehicleModal
            isOpen={addCarVisible}
            quoteDetail={quoteDetail}
            newRisk={newRisk}
            onCloseModal={() => setAddCarVisible(false)}
            onAddVehicle={(risk) => {
              setLoading(true);
              formRedirect("/action/quote/AddVehicle", {
                form: JSON.stringify({
                  risk,
                  quoteResponse,
                  redirectURL: `/quote/${quoteNumber}/customize`,
                }),
              });
            }}
          />
          <EditVehicleModal
            quoteDetail={quoteDetail}
            isOpen={editCarIndex !== null}
            defaultValue={quoteDetail.vehicles[editCarIndex]}
            quoteNumber={quoteNumber}
            onDeleteVehicle={() => setDeleteCarIndex(editCarIndex)}
            onCloseModal={() => {
              if (editCarIndex !== null) {
                setReviewableItems(
                  reviewableItems.filter(
                    (id) => id !== quoteDetail.vehicles[editCarIndex].id
                  )
                );
                setEditCarIndex(null);
              }
            }}
            onUpdate={(updatedValue) => {
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  vehicles: quoteDetail.vehicles.map((v, i) =>
                    i === editCarIndex ? updatedValue : v
                  ),
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
          />
          <DeleteVehicleModal
            isOpen={deleteCarIndex !== null}
            vehicle={quoteDetail.vehicles[deleteCarIndex]}
            onCloseModal={() => setDeleteCarIndex(null)}
            onDeleteVehicle={() => {
              setEditCarIndex(null);
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  vehicles: quoteDetail.vehicles.map((v, i) =>
                    i === deleteCarIndex ? { ...v, status: "Deleted" } : v
                  ),
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
          />
          <EditDriverModal
            infractionList={infractionList}
            driverIndex={editDriverIndex}
            isOpen={editDriverIndex !== null}
            defaultValue={
              editDriverIndex === "new"
                ? DefaultDriverInfo
                : quoteDetail.drivers[editDriverIndex]
            }
            onDeleteDriver={() => setDeleteDriverIndex(editDriverIndex)}
            onCloseModal={() => {
              if (editDriverIndex !== null && editDriverIndex !== "new") {
                setReviewableItems(
                  reviewableItems.filter(
                    (id) => id !== quoteDetail.drivers[editDriverIndex].id
                  )
                );
              }
              setEditDriverIndex(null);
            }}
            onCancel={() => {
              if (editDriverIndex !== null && editDriverIndex !== "new") {
                setReviewableItems(
                  reviewableItems.filter(
                    (id) => id !== quoteDetail.drivers[editDriverIndex].id
                  )
                );
              }
              setEditDriverIndex(null);
            }}
            onUpdate={(updatedValue) => {
              if (editDriverIndex === "new") {
                setLoading(true);
                formRedirect("/action/quote/AddDriver", {
                  form: JSON.stringify({
                    newDriver: getNewDriverParam(updatedValue),
                    quoteResponse: quoteResponse,
                    redirectURL: `/quote/${quoteNumber}/customize`,
                  }),
                });
              } else {
                setLoading(true);
                updateQuote(
                  {
                    ...quoteDetail,
                    drivers: quoteDetail.drivers.map((v, i) =>
                      i === editDriverIndex ? updatedValue : v
                    ),
                  },
                  `/quote/${quoteNumber}/customize`
                );
              }
            }}
            onUpdateDriverPoints={(
              action,
              driverNumber,
              updatedDriverPoint
            ) => {
              logger(updatedDriverPoint);
              processUpdateDriverPoints(
                action,
                driverNumber,
                updatedDriverPoint
              );
            }}
          />
          <DeleteDriverModal
            isOpen={deleteDriverIndex !== null}
            driver={quoteDetail.drivers[deleteDriverIndex]}
            onCloseModal={() => setDeleteDriverIndex(null)}
            onDeleteDriver={() => {
              setEditDriverIndex(null);
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  drivers: quoteDetail.drivers.map((v, i) =>
                    i === deleteDriverIndex ? { ...v, status: "Deleted" } : v
                  ),
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
          />

          <DiscountsModal
            isOpen={discountsModalVisible}
            lineInfo={quoteDetail.lineInfo}
            basicPolicyInfo={quoteDetail.basicPolicyInfo}
            onCloseModal={() => setDiscountsModalVisible(false)}
            onUpdate={(updatedLine, updatedBasicPolicy) => {
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  lineInfo: updatedLine,
                  basicPolicyInfo: updatedBasicPolicy,
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
          />
          <RequiredInformationModal
            isOpen={requiredInformationModalVisible.required}
            defaultValue={quoteDetail}
            onCloseModal={() =>
              setRequiredInformationModalVisible({
                required: false,
                from: null,
              })
            }
            onUpdate={(v) => {
              setLoading(true);
              updateQuote(v, `/quote/${quoteNumber}/customize`);
              // .then(() => {
              //   if (requiredInformationModalVisible.from === "checkout") {
              //     if (calcRequiredItemsLabel(v).length > 0) {
              //       setRequiredInformationModalVisible({
              //         required: true,
              //         from: "checkout",
              //       });
              //     } else {
              //       setUserInfoVisible(true);
              //     }
              //   }
              // })
              // .catch((e) => {
              //   setError(e);
              // })
              // .finally(() => setLoading(false));
            }}
          />
          <AutoPolicyModal
            isOpen={autoPolicyModalVisible}
            defaultValue={quoteDetail.planDetails}
            onUpdatePlanInfo={(updatedPlanInfo) => {
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  planDetails: updatedPlanInfo,
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
            onCloseModal={() => setAutoPolicyModalVisible(false)}
          />

          <AdditionalInterestModal
            additionalInterest={quoteDetail.additionalInterest}
            vehicles={quoteDetail.planDetails.vehicleInfo}
            isOpen={additionalInterestRequired}
            onCloseModal={() => setAdditionalInterestVisible(false)}
            onUpdate={(
              additionalInterestInfo: Array<AdditionalInterestInfo>
            ) => {
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  additionalInterest: additionalInterestInfo,
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
          />

          <LossHistoryModal
            quoteDetail={quoteDetail}
            isOpen={lossHistoryRequired}
            onCloseModal={() => setLossHistoryVisible(false)}
            lossHistory={quoteDetail.lossHistory}
            onUpdate={(lhInfo: Array<LossHistoryInfo>) => {
              setLoading(true);
              updateQuote(
                {
                  ...quoteDetail,
                  lossHistory: lhInfo,
                },
                `/quote/${quoteNumber}/customize`
              );
            }}
            onAppCloseOut={(lhInfo: Array<LossHistoryInfo>) => {
              processExternalApplicationCloseOut({
                ...quoteDetail,
                lossHistory: lhInfo,
              });
            }}
          />

          <UserInfoModal
            isOpen={userInfoRequired}
            communicationInfo={quoteDetail.communicationInfo}
            onCloseModal={() => setUserInfoVisible(false)}
            onUpdate={(communicationInfo: CommunicationInfo) => {
              setLoading(true);
              convertToApplication({
                ...quoteDetail,
                communicationInfo: communicationInfo,
              });
            }}
          />
        </Fragment>
      )}
    </Screen>
  );
};

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession(req, res);
  console.log("session: ", session);
  const quoteNumber = query.quoteNumber as string;

  if (session.user && quoteNumber) {
    let error = null;
    let quoteDetail = null;
    let infractionList = null;

    const quoteResponse = await QuoteService.getQuote(session.user, quoteNumber)
      .then((res) => {
        try {
          quoteDetail = parseQuoteResponse(res);
          return res;
        } catch (e) {
          if (Array.isArray(e)) {
            e.forEach((err) => (err.errorData.quoteNumber = quoteNumber));
          }
          error = e;
          return null;
        }
      })
      .catch((e: Array<CustomError>) => {
        if (Array.isArray(e)) {
          e.forEach((err) => (err.errorData.quoteNumber = quoteNumber));
        }
        error = e;
        return null;
      });

    if (quoteResponse && quoteDetail) {
      const matched = quoteResponse.DTOApplication.find(
        (application) =>
          application.ApplicationNumber === quoteNumber ||
          application.DTOBasicPolicy[0].QuoteNumber === quoteNumber
      );

      if (matched) {
        infractionList = await QuoteService.getInfractionList(
          session.user,
          quoteResponse.DTOApplication.filter(
            (app) =>
              app.ApplicationNumber ===
              quoteDetail.planDetails.applicationNumber
          )
        );
      } else {
        error = new CustomError(CustomErrorType.PARSE_QUOTE_FAIL, {
          quoteNumber,
        });
      }
    }

    const newRisk = session.newRisk;
    session.newRisk = null;

    return {
      props: {
        user: session.user,
        lastError: JSON.stringify(error || session.lastError),
        infractionList: infractionList,
        quoteResponse: quoteResponse,
        quoteDetail,
        newRisk,
        insurer: quoteDetail
          ? {
              firstName: quoteDetail.insurerFirstName,
              lastName: quoteDetail.insurerLastName,
              address: {
                address: `${quoteDetail.insuredAddress.Addr1}, ${quoteDetail.insuredAddress.City}, ${quoteDetail.insuredAddress.StateProvCd}`,
                unitNumber: quoteDetail.insuredAddress.Addr2,
                requiredUnitNumber: false,
                status: EAddressObjectStatus.success,
              },
            }
          : null,
      },
    };
  }

  return {
    redirect: {
      destination: "/quote",
    },
  };
}

export default CustomizePage;
