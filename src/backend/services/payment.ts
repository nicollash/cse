import { DTOApplication } from "~/types";
import { HttpService } from "~/backend/lib";
import { config } from "~/config";
import { httpClient } from "~/frontend/utils";

interface Props {
  OperationType: string;
  ApplicationRef: string;
  PaymentMethodCd: string;
}
class PaymentService {
  static async oneIncInvokePortal(req: Props, user: any) {
    return HttpService.request<any>(
      `${config.apiBaseURL}/COOneIncInvokePortalRq/json`,
      "POST",
      req,
      user.LoginToken
    );
  }

  static async issuePolicy(DTOApplication: DTOApplication[], user: any) {
    console.log("server debugging DTO 2: ", DTOApplication);
    return HttpService.request<any>(
      `${config.apiBaseURL}/IssueQuickQuoteIntoPolicyRq/json`,
      "POST",
      {
        LoginId: user.LoginId,
        DTOApplication,
      },
      user.LoginToken
    );
  }
}

export default PaymentService;

// export const oneIncInvokePortal = (req: {
//   OperationType: string
//   ApplicationRef: string
//   PaymentMethodCd: string
// }) => httpClient<any>(`${config.apiBaseURL}/COOneIncInvokePortalRq/json`, 'POST', req)

// export const issuePolicy = (LoginId: string, DTOApplication: DTOApplication[]) =>
//   httpClient<any>(`${config.apiBaseURL}/IssueQuickQuoteIntoPolicyRq/json`, 'POST', {
//     LoginId,
//     DTOApplication,
//   })
