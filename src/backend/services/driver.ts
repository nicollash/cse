import { HttpService } from "~/backend/lib";
import { DTOApplication, DriverInfo } from "~/types";
import { config } from "~/config";

class DriverService {
  static async addDriver(
    user: any,
    NewDriver: DriverInfo,
    DTOApplication: DTOApplication[]
  ) {
    return HttpService.request(
      `${config.apiBaseURL}/UpdateQuickQuoteRq/json`,
      "POST",
      {
        NewDriver,
        DTOApplication,
      },
      user.LoginToken
    );
  }

  static async updateDriverPoints(
    user: any,
    NewDriverPoint: any,
    DTOApplication: Array<DTOApplication>
  ) {
    return HttpService.request(
      `${config.apiBaseURL}/QQExternalDriverPointsSaveRq/json`,
      "POST",
      {
        LoginId: user.LoginId,
        ...NewDriverPoint,
        DTOApplication,
      },
      user.LoginToken
    );
  }
}

export default DriverService;
