import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";
import { FunctionComponent } from "react";

import {
  Row as ReactRow,
  Col as ReactCol,
  mediaBreakpointDown,
} from "react-grid";

import { Text, InfoMark } from "..";

import { utils, theme } from "~/frontend/styles";

export const Container = styled.div<{ wide?: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding: 0 50px;
  max-width: ${({ wide }) =>
    wide ? theme.wideContainerWidth : theme.containerWidth};

  ${mediaBreakpointDown("sm")} {
    padding: 0 20px;
    font-size: 12px;
  }
`;

export const BorderBox = styled.div`
  border: 2px solid ${theme.boxBorderColor};
  background-color: white;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 20px 23px 26px ${theme.boxShadowColor};
`;

export const Hr = styled.hr`
  border: none;
  height: 1px;
  background-color: ${theme.borderColor};
`;

const styles = {
  breakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
  containerMaxWidths: { sm: 540, md: 720, lg: 960, xl: 1140 },
  columns: 12,
  gutterWidth: 30,
};

export const Row = (props) => <ReactRow {...props} css={styles} />;
export const Col = (props) => (
  <ReactCol
    {...props}
    css={[styles, utils.display("flex"), utils.flexDirection("column")]}
  />
);

interface FromGroupProps {
  label?: string;
  description?: string;
  className?: string;
  textContainerClassName?: any;
  containerClassName?: any;
  bold?: boolean;
  size?: string;
}

export const FormGroup: FunctionComponent<FromGroupProps> = ({
  label = "",
  description = "",
  className,
  textContainerClassName,
  containerClassName,
  children,
  bold,
  size,
}) => (
  <div className={className}>
    {label ? (
      <div
        css={[utils.display("flex"), utils.alignItems("center"), utils.mb(2)]}
        className={textContainerClassName}
      >
        <Text css={utils.mr(3)} bold={bold} size={size}>
          {label}
        </Text>
        {description && <InfoMark description={description} />}
      </div>
    ) : (
      <div
        css={[utils.display("flex"), utils.alignItems("center"), utils.mb(2)]}
      >
        <Text
          css={[
            utils.mr(3),
            css`
              ${mediaBreakpointDown("md")} {
                display: none;
              }
            `,
          ]}
          color="transparent"
        >
          Label
        </Text>
        {description && <InfoMark description={description} />}
      </div>
    )}
    <div className={containerClassName}>{children}</div>
  </div>
);
