import type { NextPage } from "next";
import parse from "urlencoded-body-parser";
import { getSession } from "~/backend/lib";
import { PaymentService } from "~/backend/services";
import { placeAPI } from "~/frontend/utils";

const PaymentActionPage: NextPage = (props) => {
  return <div />;
};

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession(req, res);
  const body = await parse(req);
  const action = query.action as string;

  if (session.user && body.form) {
    const form = JSON.parse(body.form);

    switch (action) {
      case "oneIncInvokePortal": {
        const { req, redirectURL } = form;

        try {
          const data = await PaymentService.oneIncInvokePortal(
            req,
            session.user
          );
          session.oneIncData = data;
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }
      case "issuePolicy": {
        const { amountToPay, pf, quoteResponse, quoteDetail, redirectURL } =
          form;

        try {
          const DTOApplication = quoteResponse.DTOApplication.filter(
            (application) =>
              application.ApplicationNumber ===
              quoteDetail.planDetails.applicationNumber
          );
          const data = await PaymentService.issuePolicy(
            DTOApplication.map((app) => ({
              ...app,
              DTOBasicPolicy: [
                {
                  ...app.DTOBasicPolicy[0],
                  PayPlanCd:
                    pf === "monthly"
                      ? "insured direct bill 5 pay ca sg pa 2.0"
                      : "insured direct bill full pay ca sg pa 2.0",
                },
              ],
              DTOTransactionInfo: [
                {
                  ...(app.DTOTransactionInfo[0] || {}),
                  PaymentAmt: amountToPay,
                },
              ],
            })),
            session.user
          );
          session.issuePolicyData = data.Policy;
          session.finalQuoteResponse = quoteResponse;
          session.finalQuoteDetail = quoteDetail;
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }
    }
  }
}

export default PaymentActionPage;
