import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "~/components";
import { useError, useQuote } from "~/hooks";
import { CustomError, CustomErrorType, QuoteResponse } from "~/types";

export const QuoteLayout: FunctionComponent<any> = ({ children }) => {
  const {
    quoteResponse,
    quoteDetail,
    getQuote,
    setSelectedPlan,
    externalApplicationCloseOutFromReponse,
  } = useQuote();
  const [isInitialized, setInitialize] = useState(false);
  const router = useRouter();
  const quoteNumber = router.query.quoteNumber as string;
  const { setError } = useError();

  useEffect(() => {
    setInitialize(false);

    const matchedApplication =
      quoteResponse &&
      quoteResponse.DTOApplication.find(
        (application) =>
          application.ApplicationNumber === quoteNumber ||
          application.DTOBasicPolicy[0].QuoteNumber === quoteNumber
      );
    if (matchedApplication) {
      setInitialize(true);
    } else {
      if (router.pathname === `/quote/${quoteNumber}/checkout`) {
        if (quoteNumber.startsWith("AP")) {
          getQuote(quoteNumber)
            .then((res: QuoteResponse) => {
              externalApplicationCloseOutFromReponse(res)
                .then(() => {
                  setInitialize(true);

                  const matched = res.DTOApplication.find(
                    (application) =>
                      application.ApplicationNumber === quoteNumber ||
                      application.DTOBasicPolicy[0].QuoteNumber === quoteNumber
                  );
                  if (matched) {
                    switch (
                      matched.DTOApplicationInfo[0].IterationDescription
                    ) {
                      case "BASIC":
                        setSelectedPlan("Basic");
                        break;
                      case "STANDARD":
                        setSelectedPlan("Standard");
                        break;
                      case "PREMIUM":
                        setSelectedPlan("Premium");
                        break;
                    }
                  }
                })
                .catch((e: Array<CustomError>) => {
                  if (Array.isArray(e)) {
                    e.forEach(
                      (err) => (err.errorData.quoteNumber = quoteNumber)
                    );
                    setError(e);
                  }
                  return <Loading />;
                });
            })
            .catch((e: Array<CustomError>) => {
              if (Array.isArray(e)) {
                e.forEach((err) => (err.errorData.quoteNumber = quoteNumber));
                setError(e);
              }
              return <Loading />;
            });
        } else {
          router.push(`/quote/${quoteNumber}/review`);
          getQuoteProcess();
        }
      } else {
        getQuoteProcess();
      }
    }
  }, [quoteResponse, quoteNumber]);

  const getQuoteProcess = () => {
    getQuote(quoteNumber)
      .then((res: QuoteResponse) => {
        setInitialize(true);

        const matched = res.DTOApplication.find(
          (application) =>
            application.ApplicationNumber === quoteNumber ||
            application.DTOBasicPolicy[0].QuoteNumber === quoteNumber
        );
        if (matched) {
          switch (matched.DTOApplicationInfo[0].IterationDescription) {
            case "BASIC":
              setSelectedPlan("Basic");
              break;
            case "STANDARD":
              setSelectedPlan("Standard");
              break;
            case "PREMIUM":
              setSelectedPlan("Premium");
              break;
          }
        }
      })
      .catch((e: Array<CustomError>) => {
        if (Array.isArray(e)) {
          e.forEach((err) => (err.errorData.quoteNumber = quoteNumber));
          setError(e);
        }
        return <Loading />;
      });
  };

  if (!isInitialized) {
    return <Loading />;
  }

  if (!quoteDetail) {
    setError([
      new CustomError(CustomErrorType.PARSE_QUOTE_FAIL, { quoteNumber }),
    ]);
    return <Loading />;
  }

  return children;
};
