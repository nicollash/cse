import { jsx } from "@emotion/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import { Loading } from "~/components";
import { useAuth } from "~/hooks";
import { logger } from "~/utils";

export const CheckTokenScreen: FunctionComponent = () => {
  const router = useRouter();
  const { query } = router;
  const { action } = query;
  const { isAuthenticated, login } = useAuth();
  const [isLoginCalled, setLoginCalled] = useState(false);

  logger("action", action);
  logger("query", query);

  useEffect(() => {
    login(query.userName as string, query.password as string).finally(() => {
      setLoginCalled(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoginCalled) {
      return;
    }

    if (isAuthenticated) {
      switch (action) {
        case "login":
          router.push("/");
          break;
        case "quote":
          router.push("/quote", {
            firstName: query.FirstName,
            lastName: query.LastName,
            address: query.Address,
            unitNumber: query.UnitNo,
          });
          break;
        case "quote-detail":
          router.push(`/quote/${query.QuoteNumber}/customize`);
          break;
      }
    } else {
      router.push("/");
    }
  }, [isLoginCalled]);

  return <Loading />;
};
