import { jsx, css } from "@emotion/react";
import { FunctionComponent } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { utils, theme } from "~/frontend/styles";
import { Button, DatePicker, Text } from "~/frontend/components";
import { PlanInfo } from "~/types";
import { PaymentOptions } from "~/options";

import { Pricing } from "./pricing";
import { useLocale, useMobile } from "~/frontend/hooks";

interface Props {
  planInfo: PlanInfo;
  selected?: boolean;
  onSelect?: () => any;
  toggleDetails?: () => any;
  onCustomize?: () => any;
  showDetail: boolean;
  onUpdatePlanInfo?: (updatedPlanInfo: PlanInfo) => any;
  onContinueToCheckout?: () => any;
  changeEffectiveDate?: (date) => any;
}

export const PlanItem: FunctionComponent<Props> = ({
  planInfo,
  selected,
  onSelect,
  onCustomize,
  toggleDetails,
  showDetail,
  onUpdatePlanInfo,
  changeEffectiveDate,
  onContinueToCheckout,
  ...props
}) => {
  const { messages } = useLocale();
  const { mobileView } = useMobile();

  return (
    <div css={styles.container} {...props}>
      <div
        data-testid="plan-panel"
        css={[utils.fullWidth, selected && styles.selectedContent]}
        onClick={onSelect}
      >
        <div css={[styles.content, utils.pt("1em")]}>
          {/* pricing */}
          <Pricing
            planInfo={planInfo}
            tabIndex={Object.values(PaymentOptions.PaymentFrequency).indexOf(
              planInfo.paymentPlan
            )}
            onTabChange={(tabIndex) => {
              onUpdatePlanInfo({
                ...planInfo,
                paymentPlan:
                  PaymentOptions.PaymentFrequency[
                    Object.keys(PaymentOptions.PaymentFrequency)[tabIndex]
                  ],
              });
            }}
            data-testid="pricing"
          />

          <Button
            buttonType="outline"
            width="100%"
            css={utils.mt(5)}
            onClick={onCustomize}
            data-testid="btn-customize"
          >
            {messages.Common.CustomizePlan}
          </Button>
        </div>

        {/* Auto Coverage */}
        <div css={[styles.content, !mobileView && utils.pl("35px")]}>
          {selected && (
            <div
              css={[
                utils.display("flex"),
                utils.alignItems("center"),
                utils.flexWrap(),
                utils.justifyContent("space-between"),
                utils.fullWidth,
                utils.mb(3.8),
              ]}
            >
              <Text bold css={utils.mr(3)}>
                {messages.Common.EffectiveDate}
              </Text>
              <DatePicker
                data-testid="effective-date"
                value={planInfo.effectiveDate}
                onChange={(e) => changeEffectiveDate(e)}
                css={[utils.flex(1), utils.zIndex(100)]}
              />
            </div>
          )}
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>{messages.Coverage.BodilyInjury}</Text>
            <Text bold data-testid="bodily-injury-limit">
              {planInfo.bodilyInjuryLimit.indexOf("/") == -1
                ? `$${planInfo.bodilyInjuryLimit}`
                : `$${planInfo.bodilyInjuryLimit.split("/")[0]}/$${
                    planInfo.bodilyInjuryLimit.split("/")[1]
                  }`}
            </Text>
          </div>
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>
              {messages.Coverage.UninsuredMotorist}
            </Text>
            <Text bold data-testid="uninsured-motorist-limit">
              {planInfo.uninsuredMotoristLimit.indexOf("/") == -1
                ? `$${planInfo.uninsuredMotoristLimit}`
                : `$${planInfo.uninsuredMotoristLimit.split("/")[0]}/$${
                    planInfo.uninsuredMotoristLimit.split("/")[1]
                  }`}
            </Text>
          </div>
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>
              {messages.Coverage.MedicalPayments}
            </Text>
            <Text bold data-testid="medical-payments">
              {planInfo.medicalPaymentsLimit.indexOf("/") == -1
                ? `$${planInfo.medicalPaymentsLimit}`
                : `$${planInfo.medicalPaymentsLimit.split("/")[0]}/$${
                    planInfo.medicalPaymentsLimit.split("/")[1]
                  }`}
            </Text>
          </div>
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>
              {messages.Coverage.PropertyDamage}
            </Text>
            <Text bold data-testid="property-damage">
              {planInfo.propertyDamage.indexOf("/") == -1
                ? `$${planInfo.propertyDamage}`
                : `$${planInfo.propertyDamage.split("/")[0]}/$${
                    planInfo.propertyDamage.split("/")[1]
                  }`}
            </Text>
          </div>
        </div>

        {selected && (
          <Button
            width="100%"
            rounded={false}
            onClick={toggleDetails}
            css={utils.hideOnMobile}
            data-testid="toggle-details"
          >
            <Text color="white">
              {messages.Common.Details}
              {showDetail ? (
                <FontAwesomeIcon icon={faChevronUp} css={utils.ml(3)} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} css={utils.ml(3)} />
              )}
            </Text>
          </Button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  heading: css`
    font-weight: 800;
    font-size: 1.8em;
    text-transform: inherit;
    -moz-user-select: text;
    -khtml-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
  `,
  selectedHeading: css`
    color: ${theme.color.primary};
  `,

  content: css`
    width: 100%;
    background-color: white;
    padding: 30px;
    box-shadow: 10px 10px 36px rgba(57, 57, 57, 0.22);

    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &:first-of-type {
      z-index: 1;
    }
  `,
  selectedContent: css`
    border: 5px solid ${theme.color.primary};
    border-radius: 5px;
  `,

  type: css`
    display: flex;
    align-items: center;

    &:before,
    &:after {
      content: "";
      display: block;
      background-color: ${theme.color.primary};
      height: 5px;
      border-radius: 5px;
      width: 30px;
      margin: 0 10px;
    }
  `,

  dataItem: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 1em 0;

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.borderColor};
    }
  `,
  dataLabel: css`
    max-width: max-content;
    min-width: 50%;
  `,

  checkoutInfo: css`
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 2em 1em;
  `,
};
