import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

export const styles = {
  form: css``,

  row: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
      align-items: unset;
    }
  `,

  formGroup: css`
    flex: 1;
  `,

  deleteButton: css`
    position: absolute;
    left: 0;
  `,
}
