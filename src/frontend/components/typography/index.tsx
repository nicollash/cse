import styled from '@emotion/styled'
import { theme } from '~/frontend/styles'

export const Heading = styled.p`
  font-size: 2rem;
  color: ${theme.color.default};
  line-height: 1.25;
  font-weight: bold;
  margin: 0;
`

export const Description = styled.p`
  font-size: 14px;
  color: ${theme.color.default};
  line-height: 18px;
  font-weight: normal;
  margin: 0;
`

interface TextProps {
  bold?: boolean
  italic?: boolean
  size?: number | string
  weight?: number | string
  textAlign?: string
  color?: string
  block?: boolean
  nowrap?: boolean
}

export const Text = styled.span<TextProps & { width?: string }>`
  display: ${({ block }) => (block ? 'block' : 'inline-flex')};
  align-items: center;

  width: ${({ width }) => (width ? width : 'auto')};
  margin: 0;
  white-space: ${({ nowrap }) => (nowrap ? 'nowrap' : 'normal')};
  ${({ nowrap }) =>
    nowrap
      ? `
  text-overflow: ellipsis;
  overflow: hidden;
  `
      : ''}

  font-size: ${({ size = '1em' }) => (typeof size === 'number' ? `${size}px` : size)};
  font-weight: ${({ bold, weight }) => (bold ? '700' : weight || 'normal')};
  color: ${({ color }) => (color ? color : theme.color.default)};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : 'inherit')};
  justify-content: ${({ textAlign }) =>
    textAlign === 'left'
      ? 'flex-start'
      : textAlign === 'center'
      ? 'center'
      : textAlign === 'right'
      ? 'flex-end'
      : 'inherit'};
  line-height: 1.15;
`
