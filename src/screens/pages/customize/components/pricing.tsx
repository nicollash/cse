
import { jsx, css } from '@emotion/react'
import { FunctionComponent } from 'react'

import { Tabs, Text } from '~/components'
import { PlanInfo } from '~/types'

import { utils } from '~/styles'
import { useLocale } from '~/hooks'

interface Props {
  planInfo: PlanInfo
  tabIndex: number
  onTabChange: (e: number) => any
}

export const Pricing: FunctionComponent<Props> = ({
  planInfo,
  tabIndex,
  onTabChange,
  ...props
}) => {
  const { messages } = useLocale()
  return (
    <Tabs
      css={styles.pricing}
      tabIndex={tabIndex}
      contents={[
        {
          title: messages.Common.PayInFull,
          Content: () => (
            <div css={styles.tabContent} data-testid="pay-in-full">
              <Text size="3.75em" bold nowrap data-testid="price">                
                {/*${planInfo.fullPrice}*/}
                ${Math.round(+planInfo.fullPrice).toString() }
              </Text>
              <Text css={utils.mt(3)} bold data-testid="renewal-term">
                {planInfo.renewalTerm}
              </Text>
            </div>
          ),
        },
        {
          title: messages.Common.PayMonthly,
          Content: () => (
            <div css={styles.tabContent} data-testid="pay-monthly">
              <div css={[utils.display('flex'), utils.alignItems('center')]}>
                <Text size="2.5em" bold nowrap data-testid="price">
                  ${planInfo.monthlyPrice}
                </Text>
                <Text bold width="min-content" css={utils.ml(2)}>
                  {messages.Common.MonthlyAverage}
                </Text>
              </div>
              <Text css={utils.mt(3)} bold>
                {messages.Common.TotalPremium}&nbsp;${planInfo.totalPremiumPrice}
              </Text>
            </div>
          ),
        },
      ]}
      onTabChange={onTabChange}
      {...props}
    />
  )
}

const styles = {
  pricing: css`
    width: 100%;
    //margin-top: 1em;
    background-color: white;
    box-shadow: 10px 10px 16px rgba(57, 57, 57, 0.22);
  `,
  tabContent: css`
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
  `,
}
