import { Global, css } from "@emotion/react";

import "normalize.css";
import type { AppProps } from "next/app";

import { useEffect, Fragment } from "react";
import LogRocket from "logrocket";

import { Header, Footer, Layout } from "~/components";
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
import "../custom-styles/custom.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "~/styles/components/slider.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === "production") {
      LogRocket.init("v5j1j2/quickquote");
    }
  }, []);

  const Guard = (Component as any).Guard || Fragment;
  const guardOptions = (Component as any).guardOptions || {};
  const ComponentLayout = (Component as any).Layout || Fragment;

  return (
    <Layout>
      <LocaleProvider>
        <AuthProvider>
          <Global styles={global} />
          <QuoteProvider>
            <ErrorProvider>
              <div css={styles.container}>
                <Header />
                <Guard {...guardOptions}>
                  <ComponentLayout>
                    <Component {...pageProps} />
                  </ComponentLayout>
                </Guard>
                <Footer />
              </div>
            </ErrorProvider>
          </QuoteProvider>
        </AuthProvider>
      </LocaleProvider>
    </Layout>
  );
}
export default MyApp;

const styles = {
  container: css`
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
