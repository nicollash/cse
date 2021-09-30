import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import queryString from "query-string";

import { Loading } from "~/frontend/components";
import { logger } from "~/frontend/utils";

const CheckTokenPage: FunctionComponent = () => {
  const router = useRouter();
  const [isLoginCalled, setLoginCalled] = useState(false);

  const action = router.query.action;
  const query = router.query;

  logger("action", action);
  logger("query", router.query);

  useEffect(() => {
    login(
      router.query.userName as string,
      router.query.password as string
    ).finally(() => {
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
          router.push("/quote");
          break;
        case "quote":
          router.push(
            "/quote?" +
              queryString.stringify({
                firstName: query.FirstName,
                lastName: query.LastName,
                address: query.Address,
                unitNumber: query.UnitNo,
              })
          );
          break;
        case "quote-detail":
          router.push(`/quote/${query.QuoteNumber}/customize`);
          break;
      }
    } else {
      router.push("/quote");
    }
  }, [isLoginCalled]);

  return <Loading />;
};

export default CheckTokenPage;
