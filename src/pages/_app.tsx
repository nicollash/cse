import { jsx, Global, css } from "@emotion/react";

import "normalize.css";
import type { AppProps } from "next/app";

import { useEffect } from "react";
import LogRocket from "logrocket";

import { Header, Footer } from "~/components";
import {
  LocaleProvider,
  AuthProvider,
  QuoteProvider,
  ErrorProvider,
} from "../contexts";
import { global } from "~/styles";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../custom-styles/custom-modal.css";
import "../custom-styles/custom-date-picker.css";
import "../custom-styles/custom-slider.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === "production") {
      LogRocket.init("v5j1j2/quickquote");
    }
  }, []);

  return (
    <LocaleProvider>
      <AuthProvider>
        <Global styles={global} />
        <QuoteProvider>
          <ErrorProvider>
            <div css={styles.container}>
              <Header />
              <Component {...pageProps} />
              <Footer />
            </div>
          </ErrorProvider>
        </QuoteProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
export default MyApp;

const styles = {
  container: css`
    min-height: 100%;
    display: flex;
    flex-direction: column;
  `,

  wrapper: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  `,
};
