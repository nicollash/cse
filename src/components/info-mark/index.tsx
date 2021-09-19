import { jsx, css } from '@emotion/react'
import { FunctionComponent, Fragment, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import { theme } from '~/styles'

interface Props {
  description: string
}

export const InfoMark: FunctionComponent<Props> = ({ description }) => {
  const id = useMemo(() => uuidv4(), [])
  return (
    <Fragment>
      <a data-tip data-for={`tooltip-${id}`}>
        <FontAwesomeIcon icon={faInfoCircle} color={theme.color.primary} fontSize={24} />
      </a>
      <ReactTooltip
        id={`tooltip-${id}`}
        type="light"
        effect="solid"
        place="bottom"
        border
        borderColor="#ccc"
        backgroundColor="#fff"
      >
        <span css={styles.content}>{description}</span>
      </ReactTooltip>
    </Fragment>
  )
}

const styles = {
  content: css`
    display: block;
    max-width: 400px;
    padding: 1em;
  `,
}
