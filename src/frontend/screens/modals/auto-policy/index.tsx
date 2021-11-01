import { FunctionComponent, useMemo, useEffect } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Slider from "react-slick";

import {
  Modal,
  Heading,
  FormGroup,
  FormikSelect,
  FormikSwitch,
  Tabs,
  Button,
  Text,
  Row,
  Col,
} from "~/frontend/components";
import { utils, theme } from "~/frontend/styles";
import { useLocale } from "~/frontend/hooks";
import { CarCoverageOptions } from "~/options";
import { hasSameValue } from "~/frontend/utils";
import { logger } from "~/helpers";
import { CarCoverageInfo, PlanInfo } from "~/types";

import { CarCoverage } from "./car-coverage";
import { styles } from "./styles";

interface Props {
  isOpen: boolean;
  defaultValue: PlanInfo;
  onCloseModal?: () => any;
  onUpdatePlanInfo?: (updatedPlanInfo: PlanInfo) => any;
}

export const AutoPolicyModal: FunctionComponent<Props> = ({
  isOpen,
  defaultValue,
  onCloseModal,
  onUpdatePlanInfo,
  ...props
}) => {
  const { locale, messages } = useLocale();
  const schema = useMemo(() => Yup.object<{}>().shape({}), [locale]);

  const formik = useFormik<
    PlanInfo & { coverageInfo?: CarCoverageInfo; applyToAll?: boolean }
  >({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    initialValues: getInitialValue(defaultValue),
    onSubmit: (value) => {
      const updatedValue = getUpdatedValue(value);
      logger("updatedValue", updatedValue);
      onUpdatePlanInfo(updatedValue);
      onCloseModal();
    },
  });

  useEffect(() => {
    if (isOpen) {
      (window as any).ga && (window as any).ga("send", "Coverage Modal View");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title={messages.Coverage.CarPolicy}
      onCloseModal={onCloseModal}
      width="1100px"
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          css={styles.form}
          {...props}
        >
          <Row css={utils.alignItems("center")}>
            <Col lg={6} md={12}>
              <FormGroup label={messages.Coverage.BodilyInjury}>
                <FormikSelect
                  name="bodilyInjuryLimit"
                  css={[utils.fullWidth, utils.mb(3)]}
                  options={CarCoverageOptions.BodilyInjury.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: "bodilyInjuryLimit",
                        value: e.value,
                      },
                    });
                  }}
                />
              </FormGroup>

              <FormGroup
                label={messages.Coverage.UninsuredMotoristBodilyInjury}
              >
                <FormikSelect
                  name="uninsuredMotoristLimit"
                  css={[utils.fullWidth, utils.mb(3)]}
                  options={CarCoverageOptions.UninsuredMotorist}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: "uninsuredMotoristLimit",
                        value: e.value,
                      },
                    });
                  }}
                />
              </FormGroup>

              <FormGroup label={messages.Coverage.PropertyDamage}>
                <FormikSelect
                  name="propertyDamage"
                  css={[utils.fullWidth, utils.mb(3)]}
                  options={CarCoverageOptions.PropertyDamage}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: "propertyDamage",
                        value: e.value,
                      },
                    });
                  }}
                />
              </FormGroup>

              <FormGroup label={messages.Coverage.MedicalPayments}>
                <FormikSelect
                  name="medicalPaymentsLimit"
                  css={[utils.fullWidth, utils.mb(3)]}
                  options={CarCoverageOptions.MedicalPayments}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: "medicalPaymentsLimit",
                        value: e.value,
                      },
                    });
                  }}
                />
              </FormGroup>

              <FormGroup
                label={messages.Coverage.UM_PD_WCD_Applies}
                description={messages.Coverage.UM_PD_WCD_AppliesDesc}
              >
                <FormikSwitch
                  name="UM_PD_WCD_Applies"
                  css={[utils.fullWidth, utils.mb(3)]}
                  options={[
                    {
                      label: messages.Common.Yes,
                      value: "Yes",
                    },
                    {
                      label: messages.Common.No,
                      value: "No",
                    },
                  ]}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: "UM_PD_WCD_Applies",
                        value: e,
                      },
                    });
                  }}
                />
              </FormGroup>
            </Col>

            <Col
              lg={6}
              md={12}
              css={[
                styles.pricing,
                utils.display("flex"),
                utils.flexDirection("column"),
              ]}
            >
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.BodilyInjuryLimitPerPerson}
                </Text>
                <Text bold color={theme.color.primary}>
                  $ {formik.values.bodilyInjuryLimit.split("/")[0]}
                </Text>
              </div>
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.BodilyInjuryLimitPerAccident}
                </Text>
                <Text bold color={theme.color.primary}>
                  $ {formik.values.bodilyInjuryLimit.split("/")[1]}
                </Text>
              </div>
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.UninsuredMotoristPerPerson}
                </Text>
                <Text bold color={theme.color.primary}>
                  $ {formik.values.uninsuredMotoristLimit.split("/")[0]}
                </Text>
              </div>
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.UninsuredMotoristPerAccident}
                </Text>
                <Text bold color={theme.color.primary}>
                  ${" "}
                  {formik.values.uninsuredMotoristLimit.includes("/")
                    ? formik.values.uninsuredMotoristLimit.split("/")[1]
                    : formik.values.uninsuredMotoristLimit}
                </Text>
              </div>
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.PropertyDamage}
                </Text>
                <Text bold color={theme.color.primary}>
                  $ {formik.values.propertyDamage}
                </Text>
              </div>
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.MedicalPayments}
                </Text>
                <Text bold color={theme.color.primary}>
                  $ {formik.values.medicalPaymentsLimit}
                </Text>
              </div>
              <div css={styles.dataItem}>
                <Text css={styles.dataLabel}>
                  {messages.Coverage.UM_PD_WCD_Applies}
                </Text>
                <Text bold color={theme.color.primary}>
                  {formik.values.UM_PD_WCD_Applies.toUpperCase()}
                </Text>
              </div>
            </Col>
          </Row>

          <div css={styles.tabHeader}>
            <Heading css={utils.mb(5)}>{messages.Coverage.CarCoverage}</Heading>

            <Tabs
              tabIndex={formik.values.applyToAll ? 0 : 1}
              centerHeaders
              activeBar
              contents={[
                {
                  title: messages.Coverage.ApplyToAllCars,
                  Content: () => (
                    <div css={utils.display("flex")}>
                      <div css={styles.labels}>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.Comprehensive}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.CollisionDeductible}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.DailyRentalCarLimit}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.MedicalPartsAndAccessibility}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.RoadsideAssistance}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.FullGlass}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.LoanLeaseGap}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.OriginalReplacementCost}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.WaiveLiability}
                        </Text>
                      </div>
                      <Row css={[utils.pt("80px"), utils.flex(1)]}>
                        <Col lg={4} md={12}>
                          <CarCoverage
                            formik={formik}
                            value={formik.values.coverageInfo}
                            namePrefix="coverageInfo"
                            onChange={(e) => {
                              formik.handleChange(e);
                              logger("--- update global car coverage ---", e);
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  title: messages.Coverage.ApplyToIndividualCars,
                  Content: () => (
                    <div css={[utils.display("flex")]}>
                      <div css={styles.labels}>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.Comprehensive}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.CollisionDeductible}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.DailyRentalCarLimit}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.MedicalPartsAndAccessibility}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.RoadsideAssistance}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.FullGlass}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.LoanLeaseGap}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.OriginalReplacementCost}
                        </Text>
                        <Text textAlign="right" css={styles.formLabel}>
                          {messages.Coverage.WaiveLiability}
                        </Text>
                      </div>
                      <Slider css={styles.slider} {...sliderSettings}>
                        {formik.values.vehicleInfo.map(
                          (info, key) =>
                            info.status === "Active" && (
                              <CarCoverage
                                formik={formik}
                                value={info}
                                key={key}
                                namePrefix={`vehicleInfo.${key}`}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  logger(
                                    "--- update individual car coverage ---",
                                    key,
                                    e
                                  );
                                }}
                              />
                            )
                          //: ''
                        )}
                      </Slider>
                    </div>
                  ),
                },
              ]}
              onTabChange={(e) => {
                formik.handleChange({
                  target: {
                    name: "applyToAll",
                    value: e === 0,
                  },
                });
              }}
            />
          </div>

          <div
            css={[
              utils.centerAlign,
              utils.fullWidth,
              utils.position("relative"),
              utils.mt(4),
            ]}
          >
            <Button
              type="button"
              buttonType="secondary"
              css={utils.mr(5)}
              onClick={onCloseModal}
            >
              {messages.Common.Cancel}
            </Button>
            <Button>{messages.Common.Save}</Button>
          </div>
        </form>
      </FormikProvider>
    </Modal>
  );
};

const sliderSettings = {
  arrows: false,
  dots: true,
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  swipeToSlide: true,
  customPaging: (i) => (
    <div className="slick-dot-custom">
      <FontAwesomeIcon icon={faArrowRight} color="white" />
    </div>
  ),
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const getInitialValue = (defaultValue) => ({
  ...defaultValue,
  applyToAll: true,
  coverageInfo:
    defaultValue.vehicleInfo.length > 0
      ? {
          status: hasSameValue(
            defaultValue.vehicleInfo.map((vehicle) => vehicle.status)
          ),
          comprehensive: hasSameValue(
            defaultValue.vehicleInfo.map((vehicle) => vehicle.comprehensive)
          )
            ? defaultValue.vehicleInfo[0].comprehensive
            : "",
          collisionDeductible: hasSameValue(
            defaultValue.vehicleInfo.map(
              (vehicle) => vehicle.collisionDeductible
            )
          )
            ? defaultValue.vehicleInfo[0].collisionDeductible
            : "",
          dailyRentalCarLimit: hasSameValue(
            defaultValue.vehicleInfo.map(
              (vehicle) => vehicle.dailyRentalCarLimit
            )
          )
            ? defaultValue.vehicleInfo[0].dailyRentalCarLimit
            : "",
          medicalPartsAndAccessibility: hasSameValue(
            defaultValue.vehicleInfo.map(
              (vehicle) => vehicle.medicalPartsAndAccessibility
            )
          )
            ? defaultValue.vehicleInfo[0].medicalPartsAndAccessibility
            : "",
          roadsideAssistance: hasSameValue(
            defaultValue.vehicleInfo.map(
              (vehicle) => vehicle.roadsideAssistance
            )
          )
            ? defaultValue.vehicleInfo[0].roadsideAssistance
            : null,
          fullGlass: hasSameValue(
            defaultValue.vehicleInfo.map((vehicle) => vehicle.fullGlass)
          )
            ? defaultValue.vehicleInfo[0].fullGlass
            : null,
          loanLeaseGap: hasSameValue(
            defaultValue.vehicleInfo.map((vehicle) => vehicle.loanLeaseGap)
          )
            ? defaultValue.vehicleInfo[0].loanLeaseGap
            : null,
          originalReplacementCost: hasSameValue(
            defaultValue.vehicleInfo.map(
              (vehicle) => vehicle.originalReplacementCost
            )
          )
            ? defaultValue.vehicleInfo[0].originalReplacementCost
            : null,
          waiveLiability: hasSameValue(
            defaultValue.vehicleInfo.map((vehicle) => vehicle.waiveLiability)
          )
            ? defaultValue.vehicleInfo[0].waiveLiability
            : null,
        }
      : [],
});

const getUpdatedValue = (value) => ({
  applicationNumber: value.applicationNumber,
  UM_PD_WCD_Applies: value.UM_PD_WCD_Applies,
  bodilyInjuryLimit: value.bodilyInjuryLimit,
  effectiveDate: value.effectiveDate,
  fees: value.fees,
  fullPrice: value.fullPrice,
  medicalPaymentsLimit: value.medicalPaymentsLimit,
  monthlyPrice: value.monthlyPrice,
  paymentPlan: value.paymentPlan,
  planType: value.planType,
  propertyDamage: value.propertyDamage,
  uninsuredMotoristLimit: value.uninsuredMotoristLimit,
  vehicleInfo: value.applyToAll
    ? value.vehicleInfo.map((info) => ({
        ...info,
        comprehensive:
          value.coverageInfo.comprehensive === ""
            ? info.comprehensive
            : value.coverageInfo.comprehensive,
        collisionDeductible:
          value.coverageInfo.collisionDeductible === ""
            ? info.collisionDeductible
            : value.coverageInfo.collisionDeductible,
        dailyRentalCarLimit:
          value.coverageInfo.dailyRentalCarLimit === ""
            ? info.dailyRentalCarLimit
            : value.coverageInfo.dailyRentalCarLimit,
        medicalPartsAndAccessibility:
          value.coverageInfo.medicalPartsAndAccessibility === ""
            ? info.medicalPartsAndAccessibility
            : value.coverageInfo.medicalPartsAndAccessibility,
        roadsideAssistance:
          value.coverageInfo.roadsideAssistance === null
            ? info.roadsideAssistance
            : value.coverageInfo.roadsideAssistance,
        fullGlass:
          value.coverageInfo.fullGlass === null
            ? info.fullGlass
            : value.coverageInfo.fullGlass,
        loanLeaseGap:
          value.coverageInfo.loanLeaseGap === null
            ? info.loanLeaseGap
            : value.coverageInfo.loanLeaseGap,
        originalReplacementCost:
          value.coverageInfo.originalReplacementCost === null
            ? info.originalReplacementCost
            : value.coverageInfo.originalReplacementCost,
        waiveLiability:
          value.coverageInfo.waiveLiability === null
            ? info.waiveLiability
            : value.coverageInfo.waiveLiability,
      }))
    : value.vehicleInfo,
});
