
import styled from "@emotion/styled";
import { FunctionComponent } from "react";
import { theme } from "~/styles";

interface AlertProps {
  type?: "error";
  className?: string;
}

const borderColors = {
  error: theme.color.error,
};

const backgroundColors = {
  error: `${theme.color.error}30`,
};

const textColors = {
  error: theme.color.error,
};

const AlertWrapper = styled.div<AlertProps>`
  // border-width: 1px;
  // border-style: solid;
  // padding: 1em;

  // border-color: ${({ type }) => borderColors[type]};
  // background-color: ${({ type }) => backgroundColors[type]};
  color: ${({ type }) => textColors[type]};
`;

export const Alert: FunctionComponent<AlertProps> = ({
  type = "error",
  children,
  className,
  ...props
}) => (
  <AlertWrapper type={type} className={className} {...props}>
    {children}
  </AlertWrapper>
);
