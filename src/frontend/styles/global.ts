import { css } from '@emotion/react'
import { theme } from './theme'

export const global = css`
  /* load fonts */
  @font-face {
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('ProximaNova-Regular'),
      url('/assets/fonts/ProximaNova/ProximaNova-Regular.ttf')
        format('truetype');
  }
  @font-face {
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('ProximaNova-Light'),
      url('/assets/fonts/ProximaNova/ProximaNova-Light.ttf')
        format('truetype');
  }
  @font-face {
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('ProximaNova-Semibold'),
      url('/assets/fonts/ProximaNova/ProximaNova-Semibold.ttf')
        format('truetype');
  }
  @font-face {
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('ProximaNova-Bold'),
      url('/assets/fonts/ProximaNova/ProximaNova-Bold.ttf')
        format('truetype');
  }
  @font-face {
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: local('ProximaNova-Extrabold'),
      url('/assets/fonts/ProximaNova/ProximaNova-Extrabold.ttf')
        format('truetype');
  }

  html {
    font-family: ${theme.fontFamily};
  }

  body {
    font-size: ${theme.fontSize};
    line-height: 1.42857143;
    color: #3e3e3e;
  }

  #root {
    height: 100vh;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  * {
    box-sizing: border-box;
  }

  ::placeholder {
    color: ${theme.placeholderColor};
  }

  .pac-container:after {
    /* Disclaimer: not needed to show 'powered by Google' if also a Google Map is shown */

    background-image: none !important;
    height: 0px;
  }

  .ie-div-position-customer-chat {
    height: 0;
    overflow: hidden;
  }
  .button-iframe-wrap {
      bottom: 0px;
      position: absolute; 
  }
  .chat-iframe-wrap {
      position: fixed;
  }
`
