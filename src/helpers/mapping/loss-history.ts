import { DTOApplication, DTOLossHistory, LossHistoryInfo } from "~/types";
import {
  convertDateToString,
  maskLicenseNumber,
  convertStringToDate,
} from "./helpers";

export const parseLossHistorytoDTO = (
  lhI: Array<LossHistoryInfo>
): Array<DTOLossHistory> => {
  return lhI.map((lh) => {
    const lhDTO = {
      //id: lh.id,
      LossHistoryNumber: lh.LossHistoryNumber,
      LossDt: convertDateToString(lh.LossDt),
      LossCauseCd: lh.LossCauseCd,
      ClaimNumber: lh.ClaimNumber ? lh.ClaimNumber : "",
      ClaimStatusCd: lh.ClaimStatusCd ? lh.ClaimStatusCd : "",
      CatastropheNumber: lh.CatastropheNumber ? lh.CatastropheNumber : "",
      CarrierName: lh.CarrierName ? lh.CarrierName : "",
      //TypeCd: lh.TypeCd ? lh.TypeCd : '',
      TypeCd: "Vehicle",
      PolicyNumber: lh.PolicyNumber ? lh.PolicyNumber : "",
      LossAmt: lh.LossAmt ? lh.LossAmt : "",
      PaidAmt: lh.PaidAmt ? lh.PaidAmt : "",
      VehIdentificationNumber: lh.VehIdentificationNumber
        ? lh.VehIdentificationNumber
        : "",
      AtFaultCd: lh.AtFaultCd,
      DriverName: lh.DriverName ? lh.DriverName : "",
      DriverLicensedStateProvCd: lh.DriverLicensedStateProvCd
        ? lh.DriverLicensedStateProvCd
        : "",
      DriverLicenseNumber:
        lh.DriverLicenseNumber && !lh.DriverLicenseNumber.includes("*")
          ? lh.DriverLicenseNumber
          : lh.OriginalDriverLicenseNumber,
      Comment: lh.Comment ? lh.Comment : "",
      LossDesc: lh.LossDesc ? lh.LossDesc : "",
      StatusCd: lh.StatusCd ? lh.StatusCd : "Active",
      SourceCd: lh.SourceCd ? lh.SourceCd : "Application",
    };

    return lh.id ? { id: lh.id, ...lhDTO } : lhDTO;
  });
};

export const parseDTOtoLossHistory = (
  dtoApp: Array<DTOApplication>
): Array<LossHistoryInfo> => {
  const appIndex = dtoApp.findIndex((app) => app.DTOLossHistory);

  if (appIndex != -1) {
    return dtoApp[appIndex].DTOLossHistory.map((dtoLh) => ({
      LossHistoryNumber: dtoLh.LossHistoryNumber,
      LossDt: convertStringToDate(dtoLh.LossDt),
      LossCauseCd: dtoLh.LossCauseCd,
      ClaimNumber: dtoLh.ClaimNumber,
      ClaimStatusCd: dtoLh.ClaimStatusCd,
      CatastropheNumber: dtoLh.CatastropheNumber,
      CarrierName: dtoLh.CarrierName,
      TypeCd: dtoLh.TypeCd,
      PolicyNumber: dtoLh.PolicyNumber,
      LossAmt: dtoLh.LossAmt,
      PaidAmt: dtoLh.PaidAmt,
      VehIdentificationNumber: dtoLh.VehIdentificationNumber,
      AtFaultCd: dtoLh.AtFaultCd,
      DriverName: dtoLh.DriverName,
      DriverLicensedStateProvCd: dtoLh.DriverLicensedStateProvCd,
      DriverLicenseNumber: dtoLh.DriverLicenseNumber,
      Comment: dtoLh.Comment,
      LossDesc: dtoLh.LossDesc,
      id: dtoLh.id,
      StatusCd: dtoLh.StatusCd,
      SourceCd: dtoLh.SourceCd,
      PolicyTypeCd: dtoLh.PolicyTypeCd,
    }));
  }
  return [];
};

export const parseDTOtoLossHistorySingleQuote = (
  dtoApp: DTOLossHistory
): LossHistoryInfo => {
  return {
    LossHistoryNumber: dtoApp.LossHistoryNumber,
    LossDt: convertStringToDate(dtoApp.LossDt),
    LossCauseCd: dtoApp.LossCauseCd,
    ClaimNumber: dtoApp.ClaimNumber,
    ClaimStatusCd: dtoApp.ClaimStatusCd,
    CatastropheNumber: dtoApp.CatastropheNumber,
    CarrierName: dtoApp.CarrierName,
    TypeCd: dtoApp.TypeCd,
    PolicyNumber: dtoApp.PolicyNumber,
    LossAmt: dtoApp.LossAmt,
    PaidAmt: dtoApp.PaidAmt,
    VehIdentificationNumber: dtoApp.VehIdentificationNumber,
    AtFaultCd: dtoApp.AtFaultCd,
    DriverName: dtoApp.DriverName,
    DriverLicensedStateProvCd: dtoApp.DriverLicensedStateProvCd,
    DriverLicenseNumber: dtoApp.DriverLicenseNumber,
    OriginalDriverLicenseNumber: dtoApp.DriverLicenseNumber,
    Comment: dtoApp.Comment,
    LossDesc: dtoApp.LossDesc,
    id: dtoApp.id,
    StatusCd: dtoApp.StatusCd,
    SourceCd: dtoApp.SourceCd,
    PolicyTypeCd: dtoApp.PolicyTypeCd,
  };
};

function parseDate(LossDt: any): string {
  if (typeof LossDt === "object") {
    const date = `${LossDt.getFullYear()}${
      LossDt.getMonth() > 8
        ? LossDt.getMonth() + 1
        : "0" + (LossDt.getMonth() + 1)
    }${LossDt.getDate() > 9 ? LossDt.getDate() : "0" + LossDt.getDate()}`;

    return date;
  }

  return LossDt;
}
