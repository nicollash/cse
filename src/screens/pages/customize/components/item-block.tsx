
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { Text } from '~/components'
import { utils, theme } from '~/styles'

interface Props {
  icon?: any
  headerText: string

  className?: string
}

const Wrapper = styled.div`
  box-shadow: 20px 23px 26px ${theme.boxShadowColor};
  border: 2px solid #b7b7b7;
  background-color: #ffffff;
  padding: 1em;
  flex-wrap: wrap;
`

const Header = styled.div`
  padding: 1em 2em;
  background-color: #f5f7f8;
`

const Content = styled.div`
  padding: 1em;
`

export const ItemBlock: FunctionComponent<Props> = ({
  icon,
  headerText,

  className,
  children,
  ...props
}) => {
  return (
    <Wrapper className={className} {...props}>
      <Header>
        <Text size="1.5em" bold css={styles.wordBreak}>
          {icon && <img src={icon} css={utils.mr(3)} />}
          {headerText}
        </Text>
      </Header>
      <Content>{children}</Content>
    </Wrapper>
  )
}

const styles = {
  wordBreak: css`
    word-break: break-all;
  `,
}
