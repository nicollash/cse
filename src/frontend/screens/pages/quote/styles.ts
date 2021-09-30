import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'

export const styles = {
  container: css`
    margin-top: 200px;

    ${mediaBreakpointDown('md')} {
      padding: 20px;
      margin: 50px 20px;
      width: auto;
      background: rgba(255, 255, 255, 0.6);
      box-shadow: 10px 10px 20px -15px #000;
    }
  `,

  background: css`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;

    overflow: hidden;
  `,

  image: css`
    position: absolute;
    right: -200px;
    top: 100px;
    height: 70%;
  `,

  form: css`
    display: flex;

    ${mediaBreakpointDown('md')} {
      flex-direction: column;
    }
  `,

  quoteBtn: css`
    width: 150px;
    margin-left: -5px;
    z-index: 1;
    ${mediaBreakpointDown('md')} {
      width: 100%;
      margin-left: 0;
    }
  `,

  nameInput: css`
    width: 180px;
    margin-right: 1.5em;
    ${mediaBreakpointDown('md')} {
      width: 100%;
    }
  `,

  formGroup: css`
    margin: 0 2rem;
    min-width: 200px;
    flex: 1;
  `,

  formProductSelect: css`
      display: flex;
      flex-direction: column;
    `,

    containerProductSlect: css`
    margin-top: 150px;`
}
