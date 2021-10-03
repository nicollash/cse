import type { NextPage } from "next";
import parse from "urlencoded-body-parser";
import { getSession } from "~/backend/lib";
import {
  DriverService,
  QuoteService,
  VehicleService,
} from "~/backend/services";
import {
  getUpdatedDTOApplication,
  handleSSN,
  parseDriverPoint,
} from "~/helpers";

const QuoteActionPage: NextPage = (props) => {
  return <div />;
};

export async function getServerSideProps({ req, res, query }) {
  const session = await getSession(req, res);
  const body = await parse(req);
  const action = query.action as string;

  if (session.user && body.form) {
    const form = JSON.parse(body.form);

    switch (action) {
      case "UpdateDriverPoints": {
        const {
          action,
          driverNumber,
          newDriverPoints,
          quoteResponse,
          redirectURL,
        } = form;

        try {
          await DriverService.updateDriverPoints(
            session.user,
            parseDriverPoint(action, driverNumber, newDriverPoints),
            handleSSN(quoteResponse.DTOApplication)
          );
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }

      case "ExternalApplicationCloseOut": {
        const { newQuote, quoteResponse, redirectURL } = form;

        try {
          await QuoteService.externalApplicationCloseOut(
            session.user,
            getUpdatedDTOApplication(quoteResponse, newQuote)[0]
          );
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }

      case "GetRiskByModelSystemID": {
        const { model, redirectURL } = form;

        try {
          const result = await VehicleService.getRiskByModelSystemID(
            session.user,
            model
          );
          session.newRisk = {
            ...result.DTORisk[0],
            QuestionReplies: [
              {
                QuestionReply: [
                  {
                    Name: "OtherOwners",
                    Value: "NO",
                    VisibleInd: "Yes",
                  },
                  {
                    Name: "SpecialModificationsEquipment",
                    Value: "NO",
                    VisibleInd: "Yes",
                  },
                  {
                    Name: "ExistingDamage",
                    Value: "NO",
                    VisibleInd: "Yes",
                  },
                ],
              },
            ],
          };
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }

      case "GetRiskByVIN": {
        const { vinNumber, redirectURL } = form;

        try {
          const result = await VehicleService.getRiskByVIN(
            session.user,
            vinNumber
          );
          session.newRisk = {
            ...result.DTORisk[0],
            QuestionReplies: [
              {
                QuestionReply: [
                  {
                    Name: "OtherOwners",
                    Value: "NO",
                    VisibleInd: "Yes",
                  },
                  {
                    Name: "SpecialModificationsEquipment",
                    Value: "NO",
                    VisibleInd: "Yes",
                  },
                  {
                    Name: "ExistingDamage",
                    Value: "NO",
                    VisibleInd: "Yes",
                  },
                ],
              },
            ],
          };
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }

      case "AddVehicle": {
        const { risk, quoteResponse, redirectURL } = form;

        try {
          await VehicleService.addVehicle(
            session.user,
            risk,
            handleSSN(quoteResponse.DTOApplication)
          );
        } catch (e) {
          session.lastError = e;
        }

        return {
          redirect: {
            destination: redirectURL,
          },
        };
      }

      case "AddDriver": {
        const { newDriver, quoteResponse, redirectURL } = form;

        try {
          await DriverService.addDriver(
            session.user,
            newDriver,
            handleSSN(quoteResponse.DTOApplication)
          );
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

  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default QuoteActionPage;
