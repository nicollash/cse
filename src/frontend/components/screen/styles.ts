import { css } from '@emotion/react'
import { theme } from '~/frontend/styles'

export const styles = {
  main: css`
    font-family: ${theme.fontFamily};
    flex: 1;

    display: flex;
    flex-direction: column;
    position: relative;
  `,

  background: (bgColor) => css`
    background-color: ${bgColor};
  `,

  greyBackground: css`
    position: absolute;
    overflow: hidden;
    z-index: -1;
    top: 0;
    right: 0;
    left: 0;
    height: 100%;
    background-color: #f5f7f8;
  `,

  eMark1: css`
    position: absolute;
    top: 150px;
    right: -50px;
    height: 470px;
  `,

  eMark2: css`
    position: absolute;
    bottom: -100px;
    left: -150px;
    height: 600px;
  `,

  link: css`
    &:hover {
      text-decoration: underline;
    }
  `,
  linkActive: css`  
    text-decoration: underline;  
`,
}
