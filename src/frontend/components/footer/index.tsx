import styled from '@emotion/styled'
import { FunctionComponent } from 'react'

import { useLocale } from '~/frontend/hooks'
import { utils } from '~/frontend/styles'
import { config } from '~/config'

import { Container, Text } from '..'

const FooterWrapper = styled.div<{ hasBackground: boolean }>`
  background-color: ${({ hasBackground }) =>
    hasBackground ? 'rgba(0, 0, 0, 0.8)' : 'none'};
  padding: 0.5em;
`

export const Footer: FunctionComponent<{ hasBackground?: boolean }> = ({
  hasBackground = true,
}) => {
  const { messages } = useLocale()
  return (
    <FooterWrapper hasBackground={hasBackground}>
      <Container
        css={[
          utils.display('flex'),
          utils.alignItems('center'),
          utils.justifyContent('space-between'),
          utils.pa(0),
        ]}
      >
        <div>
          <Text color="white">{messages.Login.HaveQuestions}</Text>
          <br />
          <a href={config.supportURL} target="_blank" rel="noreferrer">
            <Text color="white">{messages.Login.WeAreHereToHelp}</Text>
          </a>
        </div>
      </Container>
    </FooterWrapper>
  )
}
