import { css } from "@emotion/react";
import { FunctionComponent, JSXElementConstructor, useState } from "react";
import { Popover, ArrowContainer, PopoverProps } from "react-tiny-popover";

interface ContentProps {
  closePopup: () => any;
}

interface ClickoverProps {
  Content: JSXElementConstructor<ContentProps>;
  hideOnOutsideClick?: boolean;
  align?: PopoverProps["align"];
  padding?: number;
  positions?: PopoverProps["positions"];
  onVisibleChange?: (changed: boolean) => any;
  hasArrow?: boolean;
}

export const Clickover: FunctionComponent<ClickoverProps> = ({
  Content,
  positions = ["bottom"],
  align = "end",
  padding = 0,
  hideOnOutsideClick = true,
  hasArrow = false,
  children,
  onVisibleChange,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={"#eee"}
          arrowSize={hasArrow ? 10 : 0}
        >
          <div css={styles.popup} onClick={(e) => e.stopPropagation()}>
            {visible && (
              <Content
                closePopup={() => {
                  setVisible(false);
                  onVisibleChange && onVisibleChange(false);
                }}
              />
            )}
          </div>
        </ArrowContainer>
      )}
      isOpen={visible}
      onClickOutside={() => {
        hideOnOutsideClick && setVisible(false);
        onVisibleChange && onVisibleChange(false);
      }}
      padding={padding}
      positions={positions}
      align={align}
      containerStyle={{ zIndex: "100001", overflow: "visible" }}
    >
      <div
        onClick={() => {
          onVisibleChange && onVisibleChange(!visible);
          setVisible(!visible);
        }}
      >
        {children}
      </div>
    </Popover>
  );
};

const styles = {
  popup: css`
    border-radius: 5px;
    border: 1px solid #ebf1f8;
    box-shadow: 20px 23px 46px rgba(32, 40, 46, 0.19);
    background-color: white;
  `,
};
