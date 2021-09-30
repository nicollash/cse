import { FunctionComponent, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faCheck } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";

import { config } from "~/config";
import { utils, theme } from "~/styles";
import { availableLanguages, flagImages } from "~/locale";
import { useLocale } from "~/hooks";

import { Container, Text, Input, Button, Hr, Clickover } from "~/components";
import { styles } from "./styles";
import { logout } from "~/services";

export const Header: FunctionComponent = () => {
  const router = useRouter();
  const { locale, messages, setLocale } = useLocale();

  const [isQuotePage, setQuotePage] = useState(false);
  const [query, setQuery] = useState<string>("");

  const parseLocation = useCallback((router) => {
    if (
      router.pathname === "" ||
      router.pathname === "/quote" ||
      router.pathname === "/quote-list"
    ) {
      setQuotePage(false);
    } else {
      setQuotePage(true);
    }

    if (router.query) {
      const query = (router.query.query as string) || "";
      setQuery(query);
    } else {
      setQuery("");
    }
  }, []);

  useEffect(() => {
    parseLocation(router);
  }, []);

  return (
    <div css={[styles.wrapper]} data-testid="header">
      <div css={styles.contactInfo}>
        <Container
          css={[
            utils.display("flex"),
            utils.alignItems("center"),
            utils.justifyContent("flex-end"),
            utils.fullHeight,
          ]}
        >
          <a
            css={utils.mr(4)}
            href={config.supportURL}
            target="_blank"
            rel="noreferrer"
          >
            <Text
              color="white"
              css={[utils.display("flex"), utils.alignItems("center")]}
            >
              <span>{messages.Header.Support}</span>
            </Text>
          </a>
          {/*
          <Text
            color="white"
            css={[utils.display('flex'), utils.alignItems('center'), utils.mr(4)]}
          >
            <FontAwesomeIcon icon={faComments} css={utils.mr(1)} />
            <span>{messages.Header.LiveChat}</span>
          </Text> */}

          <Clickover
            Content={({ closePopup }) => (
              <ul css={styles.languageList}>
                {Object.keys(availableLanguages).map((ln: string, key) => (
                  <li
                    key={key}
                    css={styles.languageListItem}
                    onClick={() => {
                      setLocale(ln);
                      closePopup();
                    }}
                  >
                    {ln === locale && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        color={theme.color.primary}
                      />
                    )}
                    <Text css={utils.mx(2)}>{availableLanguages[ln]}</Text>
                    <img src={flagImages[ln]} height="16" />
                  </li>
                ))}
              </ul>
            )}
          >
            <div css={[utils.display("flex"), utils.alignItems("center")]}>
              <Text color="white" css={utils.mr(2)}>
                {availableLanguages[locale]}
              </Text>
              <img
                css={styles.headerItem}
                src={flagImages[locale]}
                height="16"
              />
            </div>
          </Clickover>

          <Text
            color="white"
            css={[
              utils.display("flex"),
              utils.alignItems("center"),
              utils.ml(4),
              styles.headerItem,
            ]}
            onClick={() => logout()}
          >
            <span>{messages.Header.Logout}</span>
          </Text>
        </Container>
      </div>
      <Container
        css={[
          utils.display("flex"),
          utils.alignItems("center"),
          utils.justifyContent("space-between"),
          utils.height("100px"),
          isQuotePage && utils.hideOnMobile,
        ]}
      >
        <img
          css={styles.logo}
          src="/assets/images/CSE_tm_signature_rgb.png"
          onClick={() => (location.href = "/quote")}
        />
        <div css={[utils.display("flex"), utils.alignItems("center")]}>
          <div css={[utils.display("flex"), utils.mr(7), styles.searchBox]}>
            <Input
              data-testid="input-search"
              placeholder={messages.Header.SearchPlaceholder}
              width="300px"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              data-testid="btn-search"
              width="70px"
              css={styles.searchButton}
              onClick={() =>
                (location.href = query
                  ? `/quote-list?query=${query}`
                  : `/quote-list`)
              }
            >
              <Text color="white" size="18px">
                <FontAwesomeIcon icon={faSearch} />
              </Text>
            </Button>
          </div>

          <div css={[styles.menu]}>
            <Clickover
              align="end"
              padding={40}
              Content={({ closePopup }) => (
                <div css={[styles.dropdown]}>
                  <Text
                    css={styles.listItem}
                    textAlign="right"
                    onClick={() => {
                      location.href = "/quote";
                      closePopup();
                    }}
                  >
                    {messages.Menu.Home}
                  </Text>
                  <Hr />
                  <Text
                    css={styles.listItem}
                    textAlign="right"
                    onClick={() => {
                      location.href = "/quote-list";
                      closePopup();
                    }}
                  >
                    {messages.Menu.Quotes}
                  </Text>
                </div>
              )}
            >
              <Text size="40" bold css={utils.pa(3)}>
                <FontAwesomeIcon icon={faBars} />
              </Text>
            </Clickover>
          </div>
        </div>
      </Container>
    </div>
  );
};
