import { jsx } from "@emotion/react";
import { FunctionComponent, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { Button, Modal, Text } from "~/frontend/components";
import { useLocale } from "~/frontend/hooks";
import { utils } from "~/frontend/styles";
import { CustomError, CustomErrorType } from "~/types";
import { config } from "~/config";
import { styles } from "./styles";
import { useRouter } from "next/router";
import { formatErrorMessage, formRedirect } from "~/frontend/utils";

interface Props {
  error?: Array<CustomError>;
  conversationId?: string;
  onGoHome: () => any;
  onClose: () => any;
}

export const ErrorModal: FunctionComponent<Props> = ({
  conversationId,
  onGoHome,
  onClose,
  ...props
}) => {
  const error = Array.isArray(props.error) ? props.error : [props.error];
  const { messages } = useLocale();

  const router = useRouter();

  const quoteNumber = router.query.quoteNumber;

  return (
    <Modal
      isOpen={true}
      shouldCloseOnOverlayClick={true}
      width="450px"
      onCloseModal={() => {
        //onClose()
        if (
          error.some(
            (e) =>
              e.errorData &&
              (e.errorData.Name === "ApplicationNotFound" ||
                e.errorData.Name === "ApplicationDeleted" ||
                e.errorData.Name === "IncorrectOwner")
          ) ||
          error.some((e) => e.errorType == CustomErrorType.PARSE_QUOTE_FAIL)
        ) {
          formRedirect("/quote");
        } else {
          location.reload();
        }
        onClose();
      }}
      css={[utils.px(6), utils.py(6)]}
      headerMb="15px"
    >
      <div css={[utils.centerAlign, utils.flexDirection("column")]}>
        <div
          css={[
            utils.display("flex"),
            utils.fullWidth,
            utils.mb(5),
            utils.centerAlign,
            utils.flexDirection("column"),
          ]}
        >
          <div
            css={[
              utils.display("flex"),
              utils.fullWidth,
              utils.centerAlign,
              utils.flexDirection("row"),
            ]}
          >
            <Text color="black" size="1.8em">
              <FontAwesomeIcon icon={faInfoCircle} />
            </Text>
            <Text size="1em" css={[utils.mt(1), utils.pl(1)]}>
              {`${messages.ErrorModal.Oops} ${messages.ErrorModal.SomethingWentWrong}`}
            </Text>
          </div>
          {/*<div css={[utils.mt(3)]}>
            <Text color="black" size="3em">
              <FontAwesomeIcon icon={faInfoCircle} />
            </Text>
            <Text size="1em" >
              {`${messages.ErrorModal.Oops}`}
            </Text>
          </div>
          <div>
            <Text size="1em">
              {`${messages.ErrorModal.SomethingWentWrong}`}
            </Text>
          </div> */}
        </div>
        {error.map((er: CustomError, index) => (
          <div
            key={`error-item-${index}`}
            css={[
              utils.fullWidth,
              utils.display("flex"),
              utils.centerAlign,
              utils.flexDirection("column"),
            ]}
          >
            {/*<Text size="1em" css={[utils.mt(3), utils.textAlign('center')]}>
                {messages.ErrorModal.SomethingWentWrong}
                <br />({CustomError.CustomErrorType[er.errorType]})
              </Text>
              {er.errorData.Message && (
                <Text size="0.8em" css={utils.mt(1)}>
                  {er.errorData.Message}
                </Text>
              )} */}
            {/*<Text size="1em" css={[utils.mt(3), utils.textAlign('center')]}>
                {messages.ErrorModal.SomethingWentWrong}
                <br />({CustomError.CustomErrorType[er.errorType]})
              </Text> */}
            {er.errorData?.Message ? (
              <Text
                textAlign={"center"}
                color={"red"}
                size="0.8em"
                css={utils.mt(1)}
              >
                <li>
                  {" "}
                  <strong>{`${er.errorData.Name}:`}</strong>{" "}
                  {`${
                    formatErrorMessage(er.errorData.Message, [
                      "SPAN",
                      "a",
                      "A",
                      "DIV",
                    ]) || ""
                  }`}{" "}
                </li>
              </Text>
            ) : (
              <Text
                textAlign={"center"}
                color={"red"}
                size="0.8em"
                css={utils.mt(1)}
              >
                <li> {`${CustomErrorType[er.errorType]}`} </li>
              </Text>
            )}
          </div>
        ))}

        <div
          css={[
            utils.mt(2),
            utils.fullWidth,
            utils.centerAlign,
            utils.flexDirection("column"),
          ]}
        >
          {error[0].errorData?.quoteNumber ? (
            <Text size="1em" css={[utils.mt(6), utils.textAlign("center")]}>
              QuoteNumber: {error[0].errorData.quoteNumber}
            </Text>
          ) : (
            quoteNumber && (
              <Text size="1em" css={[utils.mt(6), utils.textAlign("center")]}>
                QuoteNumber: {quoteNumber}
              </Text>
            )
          )}

          {/* <a
            css={styles.centerLink}
            href={
              quoteDetail?.planDetails?.systemId
                ? `${config.spinnURL}?rq=UWApplicationSync&SystemId=${quoteDetail.planDetails?.systemId}&CodeRefOptionsKey=application-product&SecurityId=${props.conversationId}`
                : `${config.spinnURL}`
            }
            target="_blank"
            rel="noreferrer"
          >
            {messages.ErrorModal.VisitSPINN}
          </a> */}
        </div>

        {/*<a css={[styles.centerLink, utils.mt(1)]} href='' onClick={() => {
          router.push(`/quote/${quoteDetail.planDetails?.applicationNumber ? quoteDetail.planDetails?.applicationNumber : quoteDetail.planInfo[selectedPlan].applicationNumber}/customize`)
        }}>{'Go to customize page'}</a> */}

        {!error.some(
          (e) =>
            e.errorData &&
            (e.errorData.Name === "ApplicationNotFound" ||
              e.errorData.Name === "ApplicationDeleted" ||
              e.errorData.Name === "IncorrectOwner")
        ) &&
          !error.some(
            (e) => e.errorType == CustomErrorType.PARSE_QUOTE_FAIL
          ) && (
            <Button
              css={utils.mt(4)}
              buttonType="black"
              onClick={() => {
                location.reload();
              }}
            >
              {"Go to customize"}
            </Button>
          )}
      </div>
    </Modal>
  );
};
