
import { jsx, css } from '@emotion/react'
import { FunctionComponent } from 'react'
import { mediaBreakpointDown } from 'react-grid'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

import { utils, theme } from '~/styles'
import { Button, DatePicker, Text } from '~/components'
import { PlanInfo } from '~/types'
import { PaymentOptions } from '~/options'

import { Pricing } from './../pricing'
import { useLocale } from '~/hooks'

interface Props {
  planInfo: PlanInfo
  selected?: boolean
  onSelect?: () => any
  toggleDetails?: () => any
  onCustomize?: () => any
  showDetail: boolean
  onUpdatePlanInfo?: (updatedPlanInfo: PlanInfo) => any
  onContinueToCheckout?: () => any
  changeEffectiveDate?: (date) => any
}

export const PlanItem: FunctionComponent<Props> = ({
  planInfo,
  selected,
  onSelect,
  onCustomize,
  toggleDetails,
  showDetail,
  onUpdatePlanInfo,
  onContinueToCheckout,
  changeEffectiveDate,
  ...props
}) => {
  const { messages } = useLocale()

  return (
    <div css={styles.container} {...props}>
      <h1
        css={[styles.heading, selected && styles.selectedHeading, utils.fullWidth, 
          utils.display('flex'), utils.justifyContent('center'), utils.flexDirection('column'), utils.textAlign('center')]}
        data-testid="plantype"
      >
        {planInfo.planType}
        <Text width={'100%'} size={'1.2rem'}>{planInfo.applicationNumber}</Text>
      </h1>
      <div
        data-testid="plan-panel"
        css={[utils.fullWidth, selected && styles.selectedContent]}
        onClick={onSelect}
      >
        {/* type */}
        <div css={styles.content}>
          <div css={styles.type}>
            <Text size="1em" bold>
              <img src='/assets/icons/car2.png' css={utils.mr(2)} />
              AUTO
            </Text>
          </div>

          {/* pricing */}
          <Pricing
            planInfo={planInfo}
            tabIndex={Object.values(PaymentOptions.PaymentFrequency).indexOf(
              planInfo.paymentPlan,
            )}
            onTabChange={(tabIndex) =>
              onUpdatePlanInfo({
                ...planInfo,
                paymentPlan:
                  PaymentOptions.PaymentFrequency[
                    Object.keys(PaymentOptions.PaymentFrequency)[tabIndex]
                  ],
              })
            }
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
        <div css={styles.content}>
          <span css={utils.mb(5)}>
            <Text bold size="1.5em" color={theme.color.primary}>
              Auto
            </Text>{' '}
            <Text bold size="1.5em">
              {messages.Common.Coverage}
            </Text>
          </span>
          {selected && (
            <div
              css={[
                utils.display('flex'),
                utils.alignItems('center'),
                utils.flexWrap(),
                utils.justifyContent('space-between'),
                utils.fullWidth,
                utils.mb(5),
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
              {planInfo.bodilyInjuryLimit}
            </Text>
          </div>
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>{messages.Coverage.UninsuredMotorist}</Text>
            <Text bold data-testid="uninsured-motorist-limit">
              {planInfo.uninsuredMotoristLimit}
            </Text>
          </div>
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>{messages.Coverage.MedicalPayments}</Text>
            <Text bold data-testid="medical-payments">
              {planInfo.medicalPaymentsLimit}
            </Text>
          </div>
          <div css={styles.dataItem}>
            <Text css={styles.dataLabel}>{messages.Coverage.PropertyDamage}</Text>
            <Text bold data-testid="property-damage">
              {planInfo.propertyDamage}
            </Text>
          </div>

          {/* Checkout Info */}
          {selected && (
            <div css={styles.checkoutInfo}>
              <Text bold size="1.25em">
                {planInfo.planType} {messages.Common.Plan}
                <FontAwesomeIcon icon={faCar} fontSize="20" css={utils.ml(2)} />
              </Text>
              <Text
                weight="900"
                size="2em"
                css={utils.my(3)}
                data-testid="selected-price"
              >
                ${' '}
                {planInfo.paymentPlan === 'monthly'
                  ? planInfo.monthlyPrice
                  : 
                  //planInfo.fullPrice
                  Math.round(+planInfo.fullPrice).toString()}
              </Text>
              <Button
                width="100%"
                nowrap
                onClick={onContinueToCheckout}
                data-testid="btn-checkout"
              >
                {messages.Common.ContinueToReview}
              </Button>
            </div>
          )}
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
  )
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  heading: css`
    font-weight: 900;
    font-size: 2.5em;
    text-transform: uppercase;
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
      content: '';
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
    padding: 1em 0;

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.borderColor};
    }
  `,
  dataLabel: css`
    max-width: 125px;
  `,

  checkoutInfo: css`
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 2em 1em;
  `,
}
