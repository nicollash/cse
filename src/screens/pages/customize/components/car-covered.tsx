
import { jsx, css } from '@emotion/react'
import { FunctionComponent, useState } from 'react'

import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Text, Row, Col } from '~/components'
import { utils, theme } from '~/styles'
import { useLocale } from '~/hooks'
import { CarCoverageInfo } from '~/types'
import { formatCurrency } from '~/utils'

interface Props {
  vehicle: CarCoverageInfo
  className?: string
}

export const CarCovered: FunctionComponent<Props> = ({ vehicle, className }) => {
  const { messages } = useLocale()
  const [collapsed, setCollapsed] = useState<boolean>(true)

  return (
    <div css={styles.container} className={className}>
      <div css={styles.heading} onClick={() => setCollapsed(!collapsed)}>
        <Text bold>{vehicle.model}</Text>

        <div css={[styles.icon, collapsed && styles.iconCollapsed]}>
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      </div>
      <div css={[styles.content, collapsed && styles.contentCollapsed]}>
        <Row css={[styles.borderTop, utils.my(5)]}>
          <Col md={12} lg={6} css={[styles.borderTop, utils.mt('-1px')]}>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.CollisionDeductible}</Text>
              <Text size="1.25em" bold>
                {formatCurrency(vehicle.collisionDeductible)}
              </Text>
            </div>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.DailyRentalCarLimit}</Text>
              <Text size="1.25em" bold>
                {vehicle.dailyRentalCarLimit}
              </Text>
            </div>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.UninsuredMotorist}</Text>
              <Text size="1.25em" bold>
                -
              </Text>
            </div>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.LoanLeaseGap}</Text>
              <Text size="1.25em" bold>
                {vehicle.loanLeaseGap}
              </Text>
            </div>
          </Col>

          <Col md={12} lg={6} css={[styles.borderTop, utils.mt('-1px')]}>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.Comprehensive}</Text>
              <Text size="1.25em" bold>
                {vehicle.comprehensive}
              </Text>
            </div>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.RoadsideAssistance}</Text>
              <Text size="1.25em" bold>
                {vehicle.roadsideAssistance ? messages.Common.Yes : messages.Common.No}
              </Text>
            </div>
            <div css={styles.infoItem}>
              <Text bold>{messages.Coverage.FullGlass}</Text>
              <Text size="1.25em" bold>
                {vehicle.fullGlass ? messages.Common.Yes : messages.Common.No}
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const styles = {
  container: css`
    background-color: white;
    border-radius: 10px;
  `,

  heading: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2em;
  `,

  icon: css`
    font-size: 1em;
    font-weight: bold;

    transition: all 0.3s;
  `,

  iconCollapsed: css`
    transform: rotate(180deg);
  `,

  content: css`
    width: 100%;
    max-height: 1000px;
    transition: max-height 0.3s;
    overflow: hidden;
    padding: 0 2em;
  `,

  contentCollapsed: css`
    max-height: 0;
  `,

  borderTop: css`
    border-top: 1px solid ${theme.borderColor};
  `,

  infoItem: css`
    padding: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.borderColor};
    }
  `,
}
