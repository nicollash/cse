import { css } from '@emotion/react'
import { mediaBreakpointDown, mediaBreakpointUp } from 'react-grid'
import { theme } from '~/styles'

const spacingVerticalLevel = [
  '0',
  '0.5rem',
  '0.75rem',
  '1rem',
  '1.5rem',
  '2rem',
  '2.5rem',
  '3rem',
]
const spacingHorizontalLevel = [
  '0',
  '8px',
  '12px',
  '15px',
  '24px',
  '30px',
  '36px',
  '40px',
]

export const utils = {
  fullWidth: css`
    width: 100% !important;
  `,
  fullHeight: css`
    height: 100% !important;
  `,
  halfWidth: css`
    width: 50% !important;
  `,
  minWidth: (mw) =>css`
    min-width: ${mw};
  `,
  maxWidth: (mw) =>css`
    max-width: ${mw} !important;
  `,
  centerAlign: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  background: (background) => css`
    background: ${background};
  `,
  backgroundColor: (color) => css`
    background: ${color};
  `,
  wordBreak: css`
    word-break: break-all;
  `,

  borderTop: css`
    border-top: 1px solid ${theme.borderColor};
  `,

  hideOnMobile: css`
    ${mediaBreakpointDown('md')} {
      display: none;
    }
  `,

  visibleOnMobile: css`
    ${mediaBreakpointUp('lg')} {
      display: none;
    }
  `,
  textAlign: (align: string) => css`
    text-align: ${align};
  `,

  width: (width: string) => css`
    width: ${width};
  `,
  height: (height: string) => css`
    height: ${height};
  `,

  cursor: (cursor: string) => css`
  cursor: ${cursor};
  `,

  display: (display: string) => css`
    display: ${display};
  `,
  position: (position: string) => css`
    position: ${position};
  `,
  justifyContent: (type: string) => css`
    justify-content: ${type};
  `,
  alignItems: (type: string) => css`
    align-items: ${type};
  `,
  flexDirection: (direction: string) => css`
    flex-direction: ${direction};
  `,
  flexWrap: (type: string = 'wrap') => css`
    flex-wrap: ${type};
  `,

  flexGrow: (num: number) => css`
    flex-grow: ${num};
  `,
  flex: (num: number) => css`
    flex: ${num};
  `,

  ma: (level: number | string) => css`
    margin: ${typeof level === 'number'
      ? `${spacingVerticalLevel[level]} ${spacingHorizontalLevel[level]}`
      : level};
  `,
  mx: (level: number | string) => css`
    margin-left: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
    margin-right: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
  `,
  my: (level: number | string) => css`
    margin-top: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
    margin-bottom: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
  `,
  mt: (level: number | string) => css`
    margin-top: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
  `,
  mb: (level: number | string) => css`
    margin-bottom: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
  `,
  mr: (level: number | string) => css`
    margin-right: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
  `,
  ml: (level: number | string) => css`
    margin-left: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
  `,

  pa: (level: number | string) => css`
    padding: ${typeof level === 'number'
      ? `${spacingVerticalLevel[level]} ${spacingHorizontalLevel[level]}`
      : level};
  `,
  px: (level: number | string) => css`
    padding-left: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
    padding-right: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
  `,
  py: (level: number | string) => css`
    padding-top: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
    padding-bottom: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
  `,
  pt: (level: number | string) => css`
    padding-top: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
  `,
  pb: (level: number | string) => css`
    padding-bottom: ${typeof level === 'number' ? spacingVerticalLevel[level] : level};
  `,
  pr: (level: number | string) => css`
    padding-right: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
  `,
  pl: (level: number | string) => css`
    padding-left: ${typeof level === 'number' ? spacingHorizontalLevel[level] : level};
  `,

  zIndex: (index: number) => css`
    z-index: ${index};
  `,
}
