import type { NextPage } from "next";
import parse from "urlencoded-body-parser";
import { getSession } from "~/backend/lib";
import { QuoteService } from "~/backend/services";
import { CustomErrorType } from "~/types";

const GenerateQuotePage: NextPage = (props) => {
  return <div />;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  const body = await parse(req);

  if (session.user && body.form) {
    const { firstName, lastName, address } = JSON.parse(body.form);

    const { addressObj, addressInfo } = await QuoteService.parseAddress(
      session.user,
      address
    );

    try {
      const result = await QuoteService.generateQuote(session.user, {
        FirstName: firstName,
        LastName: lastName,
        Addr1: addressObj.street_address1,
        Addr2: address.unitNumber
          ? `${addressInfo.FragmentUnit} #${addressInfo.FragmentUnitNumber}`
          : null,
        City: addressObj.city,
        StateProvCd: addressObj.state,
        PostalCode: addressObj.postal_code,
      });

      session.lastError = null;

      return {
        redirect: {
          destination: `/quote/${result.DTOApplication[0].ApplicationNumber}/customize`,
        },
      };
    } catch (error) {
      error = error.map((er) => {
        if (er.message.includes("403")) {
          er.errorType = CustomErrorType.QUOTE_LIMIT_EXCEEDED;
        }
        return er;
      });
      session.lastError = error;
    }
  }
  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default GenerateQuotePage;
