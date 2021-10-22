import styled from "@emotion/styled";
import { FunctionComponent } from "react";
import Link from "next/link";

import { Text } from "~/components";
import { TBreadCrumb } from "~/types";
import { utils, theme } from "~/styles";

interface props {
  breadCrumb: TBreadCrumb[];
  className?: string;
}

const BreadCrumbWrapper = styled.div`
  display: flex;
`;

export const BreadCrumb: FunctionComponent<props> = ({
  breadCrumb,
  className,
  ...props
}) => {
  return (
    <BreadCrumbWrapper className={className} {...props}>
      {breadCrumb.map((item, key) =>
        key < breadCrumb.length - 1 ? (
          <div css={[utils.mr(1), utils.display("flex")]} key={key}>
            <Link href={item.link ? item.link : "/quote"}>
              <Text color={theme.color.link} bold css={[utils.mr(1), utils.cursor('pointer')]}>
                {item.label}
              </Text>
            </Link>
            /
          </div>
        ) : (
          <div key={key}>
            <Text color={theme.color.link} bold>
              {item.label}
            </Text>
          </div>
        )
      )}
    </BreadCrumbWrapper>
  );
};
