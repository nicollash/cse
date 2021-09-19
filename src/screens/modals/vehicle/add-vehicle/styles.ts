import { mediaBreakpointDown } from 'react-grid'
import { css } from '@emotion/react'

export const styles = {
  form: css`
    display: flex;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

  vinNumberInput: css`
    width: 340px;

    ${mediaBreakpointDown('md')} {
      width: 100%;
    }
  `,

  addCarBtn: css`
    width: 130px;
    margin-left: 100px;
    margin-bottom: 1em;

    ${mediaBreakpointDown('md')} {
      margin-left: 0;
      width: 100%;
    }
  `,

  modelSelector: css`
    flex: 1;
    margin-right: 36px;
    margin-bottom: 1em;

    ${mediaBreakpointDown('md')} {
      margin-right: 0;
    }
  `,

  selectInput: css`
    width: 100%;
  `,
}
