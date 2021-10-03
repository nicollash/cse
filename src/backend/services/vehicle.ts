import { config } from "~/config";
import {
  DTOApplication,
  DTORisk,
  MakeModelResponse,
  NewRiskResponse,
  QuoteResponse,
} from "~/types";
import { HttpService } from "../lib";

class VehicleService {
  static async getMakeList(user: any, year: string) {
    return HttpService.request<MakeModelResponse>(
      `${config.apiBaseURL}/GetVinManufacturerSelectListRq/json`,
      "POST",
      {
        ModelYear: year,
      },
      user.LoginToken
    ).then((res) => {
      return (
        res.Option?.map((el) => ({ label: el.Name, value: el.Name })) || []
      );
    });
  }

  static async getModelList(user: any, year: string, make: string) {
    return HttpService.request<MakeModelResponse>(
      `${config.apiBaseURL}/GetVinModelSelectListRq/json`,
      "POST",
      {
        ModelYear: year,
        Manufacturer: make,
      },
      user.LoginToken
    ).then((res) => {
      return (
        res.Option?.map((el) => ({ label: el.Name, value: el.Value })) || []
      );
    });
  }

  static async getRiskByVIN(user: any, VIN: string) {
    return HttpService.request<NewRiskResponse>(
      `${config.apiBaseURL}/GetRiskByVehicleIdRq/json`,
      "POST",
      {
        VIN,
      },
      user.LoginToken
    );
  }

  static async getRiskByModelSystemID(user: any, ModelSystemId: string) {
    return HttpService.request<NewRiskResponse>(
      `${config.apiBaseURL}/GetRiskByVehicleModelRq/json`,
      "POST",
      {
        ModelSystemId,
      },
      user.LoginToken
    );
  }

  static async addVehicle(
    user: any,
    DTORisk: DTORisk,
    DTOApplication: DTOApplication[]
  ) {
    return HttpService.request<QuoteResponse>(
      `${config.apiBaseURL}/UpdateQuickQuoteRq/json`,
      "POST",
      {
        DTORisk,
        DTOApplication,
      },
      user.LoginToken
    );
  }
}

export default VehicleService;
