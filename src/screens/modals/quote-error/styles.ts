import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

export const styles = {
  form: css`
    margin-top: 2em;
  `,
  row: css`
    display: flex;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

  quoteBtn: css`
    width: 150px;
    z-index: 1;
    ${mediaBreakpointDown('md')} {
      width: 100%;
      margin-left: 0;
    }
  `,

  nameInput: css`
    flex: 1;

    ${mediaBreakpointDown('md')} {
      width: 100%;
    }

    &:not(:last-child) {
      margin-right: 1.5em;
    }
  `,
}
