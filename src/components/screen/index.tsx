import { FunctionComponent, Fragment } from "react";
import Head from "next/head";

import { TBreadCrumb } from "~/types";
import { utils } from "~/styles";

import { styles } from "./styles";
import { Container, BreadCrumb, Loading } from "../index";
import { config } from "~/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkSquareAlt } from "@fortawesome/free-solid-svg-icons";
import CookieConsent from "react-cookie-consent";

import { theme } from "~/styles";
import { useLocale } from "~/hooks";

interface ScreenProps {
  title?: string;
  link?: string;
  breadCrumb?: TBreadCrumb[];
  color?: string;
  loading?: boolean;
  greyBackground?: boolean;
  quoteNumber?: string;
  systemId?: string;
  className?: string;
  conversationId?: string;
}

export const Screen: FunctionComponent<ScreenProps> = ({
  title,
  link,
  breadCrumb,
  color,
  loading,
  children,
  greyBackground,
  quoteNumber,
  systemId,
  className,
  conversationId,
}) => {
  const { messages } = useLocale();

  return (
    <Fragment>
      <Head>
        {title && <title>{title}</title>}
        {link && <link rel="canonical" href={link} />}
      </Head>

      {greyBackground && (
        <div css={styles.greyBackground}>
          <img src="/assets/images/e-mark.png" css={styles.eMark1} />
          <img src="/assets/images/e-mark.png" css={styles.eMark2} />
        </div>
      )}

      <Container wide css={[utils.my(3), utils.hideOnMobile]}>
        <div
          css={[
            utils.display("flex"),
            utils.alignItems("center"),
            utils.justifyContent("space-between"),
          ]}
        >
          {breadCrumb && <BreadCrumb breadCrumb={breadCrumb} />}

          {quoteNumber && systemId && conversationId && (
            <div>
              <span>{quoteNumber}</span>
              <FontAwesomeIcon
                title="Visit SPINN"
                icon={faExternalLinkSquareAlt}
                css={[utils.ml(3), utils.cursor("pointer")]}
                onClick={() => {
                  window.open(
                    `${config.spinnURL}?rq=UWApplicationSync&SystemId=${systemId}&CodeRefOptionsKey=application-product&SecurityId=${conversationId}`,
                    "_blank"
                  );
                }}
              />
            </div>
          )}
        </div>
      </Container>

      <main
        className={className}
        css={[styles.main, color && styles.background(color)]}
      >
        {children}
      </main>

      {loading && <Loading />}
      <CookieConsent
        location={"top"}
        cookieName="cse_cookie_consent"
        overlay
        buttonText={messages.Common.CookieConsentBotton}
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          textAlign: "justify",
        }}
        buttonStyle={{
          background: `${theme.color.primary}`,
          color: "white",
        }}
      >
        {messages.Common.CookieConsentMessage}
      </CookieConsent>
    </Fragment>
  );
};
