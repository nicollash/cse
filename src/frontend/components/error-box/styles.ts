import { mediaBreakpointDown } from 'react-grid'
import { mediaBreakpointUp } from 'react-grid'
import { css } from "@emotion/react";
import { theme } from "~/frontend/styles";

export const styles = {
  col: css`
      outline: none;
      height: 100%;
    `,

  errorBox: css`
        box-shadow: 20px 23px 26px rgb(57 57 57 / 22%);
        border: 2px solid ${theme.color.borderGrey};
        background-color: #ffffff;
        padding-top: 0.5em;
        padding-bottom: 0.5em;
        padding-left: 1em;
        padding-right: 1em;
        background-color: white
    `,

  row: css`
    flex-wrap: nowrap;
    ${mediaBreakpointDown('md')} {
      overflow: scroll;
    }`,

  simpleBtn: css`
      background: none;
      color: ${theme.color.primary};
      padding: 0;
      border: none;
      box-shadow: none;
    `,

  goToSpBtn: css`
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 3px;
    padding-right: 3px;    
  `,

  link: css`
    color: blue;
    &:hover {
      text-decoration: underline;
    }
    `,
}