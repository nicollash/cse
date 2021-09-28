import styled from "@emotion/styled";
import { FunctionComponent, useState } from "react";
import { theme, utils } from "~/styles";
import { Col, Container, Row } from "../layout";

import { Button, Text } from "~/components";
import { styles } from "./styles";
import { ValidationError } from "~/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { config } from "~/config";
import { formatErrorMessage } from "~/utils";
import { SerializedStyles } from "@emotion/utils";

interface ErrorProps {
  data: Array<ValidationError>;
  cp?: boolean;
  actions?: Array<{ text: string; contains: string; action: any }>;
  systemId: string;
  css?: SerializedStyles | SerializedStyles[];
}

export const ErrorBox: FunctionComponent<ErrorProps> = ({ css, ...props }) => {
  const [linesToShow, setShowLines] = useState({ lines: 3 });
  const conversationId = localStorage.getItem("cse_ConversationId");

  return (
    <Container
      wide
      css={[utils.flex(1), ...(Array.isArray(css) ? css : [css])]}
    >
      <Row css={[utils.fullWidth, utils.ma(0)]}>
        <Col
          xl={10}
          lg={12}
          css={[utils.display("flex"), utils.flexDirection("column")]}
        >
          <Row
            css={[
              utils.display("flex"),
              utils.alignItems("center"),
              styles.row,
            ]}
          >
            <Col
              css={[
                styles.col,
                styles.errorBox,
                utils.display("flex"),
                utils.flexDirection("column"),
              ]}
              xl={props.cp ? 9 : 12}
              lg={12}
            >
              <Text
                textAlign={"start"}
                color={"red"}
                bold
                size="0.9em"
                css={[utils.mt(1), utils.fullWidth]}
              >
                Underwriting Status
              </Text>
              {props.data.map((error, lineIndex) =>
                linesToShow.lines == -1 ||
                lineIndex + 1 <= linesToShow.lines ? (
                  <Text
                    key={`txt_err_${lineIndex}`}
                    textAlign={"start"}
                    color={"red"}
                    size="0.8em"
                    css={[utils.fullWidth, utils.mt(1)]}
                  >
                    <li key={`li_err_${lineIndex}`}>
                      {" "}
                      {`${
                        formatErrorMessage(error.TypeCd + ": " + error.Msg, [
                          "SPAN",
                          "a",
                          "A",
                          "DIV",
                        ]) || ""
                      }`}{" "}
                    </li>
                    {props.actions &&
                      props.actions.some((act) =>
                        error.Msg.includes(act.contains)
                      ) && (
                        <a
                          css={[utils.ml(2), styles.link]}
                          id="a1"
                          href="#"
                          onClick={() =>
                            props.actions
                              .find((act) => error.Msg.includes(act.contains))
                              .action(error)
                          }
                        >
                          - View
                        </a>
                      )}
                    {error.TypeCd && error.TypeCd == "Non-bound" && (
                      <Button
                        css={[styles.goToSpBtn, utils.ml(2)]}
                        type="button"
                        onClick={() => {
                          window.open(
                            `${config.spinnURL}?rq=UWApplicationUpdateCloseout&SystemId=${props.systemId}&CodeRefOptionsKey=application-product&SecurityId=${conversationId}`,
                            "_blank"
                          );
                        }}
                      >
                        {"Go To SPInn"}
                      </Button>
                    )}
                  </Text>
                ) : (
                  ""
                )
              )}
              {props.data.length > 3 && (
                <div
                  css={[
                    utils.fullWidth,
                    utils.display("flex"),
                    utils.justifyContent("center"),
                    utils.mt(2),
                  ]}
                >
                  {linesToShow.lines != -1 ? (
                    <Button
                      css={styles.simpleBtn}
                      type="button"
                      onClick={() => setShowLines({ lines: -1 })}
                    >
                      {"Show more"}
                      <FontAwesomeIcon icon={faChevronDown} css={utils.ml(3)} />
                    </Button>
                  ) : (
                    <Button
                      css={styles.simpleBtn}
                      type="button"
                      onClick={() => setShowLines({ lines: 3 })}
                    >
                      {"Show less"}
                      <FontAwesomeIcon icon={faChevronUp} css={utils.ml(3)} />
                    </Button>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
