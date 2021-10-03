import type { NextPage } from "next";
import parse from "urlencoded-body-parser";
import { getSession } from "~/backend/lib";
import { QuoteService } from "~/backend/services";
import { getUpdatedDTOApplication } from "~/helpers";

const UpdateQuotePage: NextPage = (props) => {
  return <div />;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  const body = await parse(req);

  if (session.user && body.form) {
    const { quoteResponse, quoteDetail } = JSON.parse(body.form);

    try {
      const newDTOApplications = getUpdatedDTOApplication(
        quoteResponse,
        quoteDetail
      );
      const result = await QuoteService.updateQuote(
        session.user,
        newDTOApplications
      );

      session.lastError = null;

      return {
        redirect: {
          destination: `/quote/${result.DTOApplication[0].ApplicationNumber}/customize`,
        },
      };
    } catch (error) {
      session.lastError = error;
    }
  }
  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default UpdateQuotePage;
