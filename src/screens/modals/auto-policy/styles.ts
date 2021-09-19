import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

import { theme } from '~/styles'

export const styles = {
  form: css``,

  pricing: css`
    border-radius: 5px;
    background-color: #f5f7f8;
  `,

  dataItem: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;

    &:not(:last-of-type) {
      border-bottom: 1px solid ${theme.borderColor};
    }
  `,
  dataLabel: css`
    max-width: 250px;
  `,

  type: css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1em 0;

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

  tabContent: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
  `,

  tabHeader: css`
    background-color: #f5f7f8;
    padding-top: 80px;
    padding-left: 60px;
    padding-right: 60px;
    margin-left: -60px;
    margin-right: -60px;

    ${mediaBreakpointDown('md')} {
      padding-top: 40px;
      padding-left: 20px;
      padding-right: 20px;
      margin-left: -20px;
      margin-right: -20px;
    }
  `,

  row: css`
    margin: 0;
    flex-wrap: nowrap;
    flex-grow: 1;
  `,

  labels: css`
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    width: 200px;
    ${mediaBreakpointDown('md')} {
      display: none;
    }
  `,

  slider: css`
    width: calc(100% - 200px);
  `,

  formLabel: css`
    height: 68px;
    min-width: 200px;
  `,
}
