import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

export const styles = {
  form: css``,

  row: css`
    margin: 0 -50px;
    display: flex;
    flex-wrap: wrap;

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

  icon: css`
    font-size: 2em;
    font-weight: bold;
    cursor: pointer;

    transition: all 0.3s;
    `,
    linearLines: css`
        display: flex !important;
        flex-wrap: wrap;
        flex-direction: row;    
    `,
    subSelect: css`
    color: #000000;
    min-width: 250px;
  `,
  interestNameContainer: css`
    min-width:50%;
    ${mediaBreakpointDown('md')} {
        width: 100%
      }
    `,
    interestNameArea: css`
    min-width:80%
    `,
    saveButton: css`
    width: 100%;
    display: flex !important;
    justify-content: center;
    margin-bottom: 1rem;
    `,
    cancelBottomContainer: css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
    `,
}
