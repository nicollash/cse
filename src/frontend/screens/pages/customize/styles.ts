import { mediaBreakpointDown } from 'react-grid'
import { mediaBreakpointUp } from 'react-grid'
import { css } from '@emotion/react'
import { theme } from '~/frontend/styles'

export const styles = {
  tab: css`
    padding: 8px 25px 10px;
    background-color: white;
    box-shadow: 20px 20px 46px ${theme.boxShadowColor};
    position: relative;
  `,

  activeTab: css`
    &:after {
      content: '';
      height: 10px;
      border-radius: 5px;
      background-color: ${theme.color.primary};
      display: block;
      margin: auto;
      position: absolute;
      bottom: 0;
      right: 50px;
      left: 50px;
    }
  `,

  whiteBackground: css`
    background-color: white;
    z-index: 1;
  `,

  reviewItems: css`
    ${mediaBreakpointUp('lg')} {
      position: absolute;
      top: 48%;
      transform: translate(0, -50%);
      border: none;
      width: 100%;
    }
  `,

  row: css`
    flex-wrap: nowrap;
    ${mediaBreakpointDown('md')} {
      overflow: scroll;
    }
  `,

  col: css`
    outline: none;
    height: 100%;
  `,

  table: css`
    td {
      height: 50px;
      border-top: 1px solid ${theme.borderColor};
    }
  `,

  footer: css`
    box-shadow: 0 -16px 15px ${theme.boxShadowColor};
    background-color: #f4f6f7;
    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

  tabSelector: css`
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: lightgrey;
  `,

  selectedTab: css`
    background-color: white;
  `,

  texting: css`
    flex-wrap: nowrap;
    ${mediaBreakpointDown('md')} {
      flex-wrap: wrap;
    }
  `,

  autoPolicy: css`
    padding: 20px 100px 20px 1000px;
    margin-left: -1000px;
  `,

  infoItem: css`
    padding: 1.5em 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.borderColor};
    }

    & > *:first-of-type {
      flex: 1;
    }

    & > *:last-of-type {
      overflow: hidden;
      margin-left: 10px;
    }
  `,

  heading: css`
    ${mediaBreakpointDown('md')} {
      text-align: center;
    }
  `,
  errorBox: css`
    border: 5px solid ${theme.color.primary};
    border-radius: 5px;
  `
}
