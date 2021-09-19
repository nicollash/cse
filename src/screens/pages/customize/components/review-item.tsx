
import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { faPen } from '@fortawesome/free-solid-svg-icons'

import { IconButton, Text } from '~/components'
import { utils, theme } from '~/styles'

interface Props {
  header: string
  items?: Array<string>
  onEdit?: () => any
  className?: string
}

const Container = styled.div`
  background-color: #f5f7f8;
  padding: 0 1em;
`

const Wrapper = styled.div<{ header?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1em 0;
  flex-wrap: wrap;
  border-bottom: ${({ header }) => (header ? `1px solid ${theme.borderColor}` : 'none')};
`

const editButtonStyle = css`
  cursor: pointer;
`

export const ReviewItem: FunctionComponent<Props> = ({
  header,
  items = [],
  onEdit,
  className,
  children,
  ...props
}) => (
  <Container className={className} {...props}>
    <Wrapper header>
      <Text weight={900} css={utils.flex(1)}>
        {header}
      </Text>
      {onEdit && <IconButton css={[utils.ml(2), editButtonStyle]} icon={faPen} onClick={onEdit} />}
    </Wrapper>
    {items.map((item, key) => (
      <Wrapper key={key}>
        <Text>{item}</Text>
      </Wrapper>
    ))}
    {children}
  </Container>
)
