import { Global, css } from "@emotion/react";

import "normalize.css";
import type { AppProps } from "next/app";

import { useEffect } from "react";
import LogRocket from "logrocket";

import { Header, Footer } from "~/frontend/components";
import { LocaleProvider, ErrorProvider } from "../frontend/contexts";
import { global } from "~/frontend/styles";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "~/frontend/styles/components/custom-modal.css";
import "~/frontend/styles/components/custom-date-picker.css";
import "~/frontend/styles/components/custom-slider.css";
import "~/frontend/styles/components/custom.css";
import "~/frontend/styles/components/slider.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === "production") {
      LogRocket.init("v5j1j2/quickquote");
    }
  }, []);

  return (
    <LocaleProvider>
      <Global styles={global} />
      <ErrorProvider>
        <div css={styles.container}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </ErrorProvider>
    </LocaleProvider>
  );
}
export default MyApp;

const styles = {
  container: css`
    position: relative;
    min-height: 100vh;
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
