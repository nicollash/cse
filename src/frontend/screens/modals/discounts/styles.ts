import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

export const styles = {
  form: css``,

  row: css`
    margin: 0 -50px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

  formGroup: css`
    margin: 0 50px;

    min-width: 200px;
    flex: 1;
  `,

  deleteButton: css`
    position: absolute;
    left: 0;
  `,

  subSelect: css`
    color: #000000
  `,
}
