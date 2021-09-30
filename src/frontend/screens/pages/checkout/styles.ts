import { css } from '@emotion/react'
import { mediaBreakpointDown, mediaBreakpointUp } from 'react-grid'

export const styles = {
  checkoutInformation: css`
    display: flex;
    width: 100%;
    max-width: 1280px;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

  billingInformation: css`
    ${mediaBreakpointUp('lg')} {
      margin-right: 140px;
    }
  `,

  formRow: css`
    display: flex;
    justify-content: space-between;
    margin-top: 1.5em;
    margin-bottom: 1.5em;

    & > * {
      flex: 1;
      &:not(:last-child) {
        margin-right: 2em;
      }
    }

    ${mediaBreakpointDown('md')} {
      flex-direction: column;

      & > * {
        margin-right: 0 !important;
        &:not(:last-child) {
          margin-bottom: 1.5em;
        }
      }
    }
  `,

  whiteBackground: css`
    flex: 1;
    background-color: white;
  `,

  paymentInformation: {
    container: css`
      width: 100%;
      max-width: 780px;
      box-shadow: 20px 23px 36px rgba(57, 57, 57, 0.22);
      border-radius: 10px;
      border: 2px solid #e0e7ed;
      background-color: #ffffff;
      padding: 1em;
      margin-top: 2em;
    `,
    header: css`
      padding: 1em;
      background-color: #f5f7f8;
    `,
    description: css`
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;

      ${mediaBreakpointDown('md')} {
        align-items: center;
      }
    `,
  },

  switch: css`
    width: 100%;
    max-width: 450px;
  `,
  iconCustom: css`
    cursor:pointer;
  `,
}
