import { css } from '@emotion/react'
import { mediaBreakpointDown } from 'react-grid'
import { theme } from '~/styles'

export const styles = {
  wrapper: css`
    background: ${theme.header.background};
    box-shadow: 0 13px 36px ${theme.boxShadowColor};
  `,

  logo: css`
    height: ${theme.header.logoHeight};
    cursor: pointer;
  `,

  contactInfo: css`
    height: 50px;
    background-color: ${theme.color.primary};
  `,

  searchBox: css`
    ${mediaBreakpointDown('sm')} {
      display: none;
    }
  `,

  searchButton: css`
    margin-left: -5px;
  `,

  menu: css`
    position: relative;
    cursor: pointer;
  `,

  dropdown: css`
    width: 380px;
    padding: 40px;
  `,

  listItem: css`
    padding: 1em;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,

  languageList: css`
    padding: 20px;
    list-style: none;
    margin: 0;
  `,

  languageListItem: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,

  selectedLanguage: css``,
  headerItem: css`
    cursor: pointer
  `
}
