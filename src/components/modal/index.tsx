import { FunctionComponent } from "react";

import ReactModal from "react-modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { utils } from "~/styles";
import { useLocale } from "~/hooks";

import { Footer as PageFooter, Heading, Text } from "..";
import { styles, customStyles } from "./styles";

interface ModalProps {
  isOpen: boolean;
  width?: string;
  zIndex?: number;
  onCloseModal?: () => any;
  title?: string;
  shouldCloseOnOverlayClick?: boolean;
  Footer?: FunctionComponent;
  headerMb?: string;
  additionalInfo?: boolean;
  additionalInfoMessage?: string;
  className?: string;
}

ReactModal.setAppElement("body");

export const Modal: FunctionComponent<ModalProps> = ({
  isOpen,
  onCloseModal,
  title,
  shouldCloseOnOverlayClick = true,
  Footer,
  children,
  width,
  zIndex,
  headerMb,
  additionalInfo,
  additionalInfoMessage,
  className,
  ...props
}) => {
  const { messages } = useLocale();

  return (
    <ReactModal
      isOpen={isOpen}
      closeTimeoutMS={250}
      onRequestClose={onCloseModal}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      className={className}
      style={customStyles({ width, zIndex })}
    >
      <div css={styles.container} {...props}>
        {additionalInfo && (
          <div css={[utils.fullWidth, utils.mb(1)]}>
            <Text color={"red"} size={"1em"}>
              {additionalInfoMessage}
            </Text>
          </div>
        )}
        <div css={[styles.header, headerMb && styles.marginBottom(headerMb)]}>
          <Heading>{title}</Heading>
          {shouldCloseOnOverlayClick && (
            <Text bold size="16px" onClick={onCloseModal} css={styles.closeBtn}>
              {messages.Common.Close}
              <FontAwesomeIcon icon={faTimes} css={utils.ml(2)} />
            </Text>
          )}
        </div>
        <div css={styles.body}>{children}</div>
        {Footer && (
          <div css={styles.footer}>
            <Footer />
          </div>
        )}
      </div>
      <PageFooter hasBackground={false} />
    </ReactModal>
  );
};
