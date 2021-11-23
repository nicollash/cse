import {
  QuoteResponse,
  QuoteDetail,
  DTOApplication,
  CustomError,
  PlanInfo,
  PlanType,
  DTOARPayPlan,
  PaymentScheduleItem,
  DriverPointsInfo,
  CustomErrorType,
} from "~/types";

import { parseRisk, getUpdatedRisk } from "./risk";
import {
  getCorrectVinNumber,
  convertStringToDate,
  convertDateToString,
} from "./helpers";
import { logger } from "../logger";
import {
  parseAdditionalInterestAItoDTO,
  parseAdditionalInterestDTOtoAI,
} from "./additional-interest";
import { ElectronicPaymentSource } from "~/types/DTO/common";
import {
  parseDTOtoLossHistorySingleQuote,
  parseLossHistorytoDTO,
} from "./loss-history";
import { DTOARSchedule } from "~/types/DTO/pay-plan";

export const convertApplicationToPlan = (
  application: DTOApplication,
  arPayPlan: DTOARPayPlan,
  type: PlanType
): PlanInfo => ({
  applicationNumber: application.ApplicationNumber,
  systemId: application.SystemId,
  isQuote: application.ApplicationNumber.startsWith("NRA"),
  planType: type,
  monthlyPrice: Math.round(+arPayPlan.DTOARSchedule[0].GrossAmt).toString(),
  downPayment: arPayPlan.DTOARSchedule[0].BillAmt.toString(),
  paymentSchedule: parseSchedulePlan(arPayPlan.DTOARSchedule),
  installmentFee:
    arPayPlan.DTOARSchedule[0].DTOARApply[
      arPayPlan.DTOARSchedule[0].DTOARApply.length - 1
    ].Amount,
  writtenFeeAmt: application.DTOBasicPolicy[0].WrittenFeeAmt,
  renewalTerm: application.DTOBasicPolicy[0].RenewalTermCd,
  paymentPlan: application.DTOBasicPolicy[0].PayPlanCd.includes(
    "insured direct bill full pay ca sg pa"
  )
    ? "full"
    : "monthly",
  fullPrice: application.DTOLine[0].WrittenPremiumAmt, // application.DTOBasicPolicy[0].QuotedPremiumForCompRater,
  totalPremiumPrice: Math.round(
    +application.DTOLine[0].WrittenPremiumAmt
  ).toString(), // application.DTOBasicPolicy[0].QuotedPremiumForCompRater,
  effectiveDate: convertStringToDate(application.DTOBasicPolicy[0].EffectiveDt),
  bodilyInjuryLimit: application.DTOLine[0].BILimit || "",
  uninsuredMotoristLimit: application.DTOLine[0].UMBILimit || "",
  medicalPaymentsLimit: application.DTOLine[0].MedPayLimit || "",
  UM_PD_WCD_Applies: application.DTOLine[0].UMPDWCDInd || "",
  propertyDamage: application.DTOLine[0].PDLimit || "",

  vehicleInfo: application.DTOLine[0].DTORisk
    ? application.DTOLine[0].DTORisk.map((risk) => ({
        id: risk.DTOVehicle[0].id,
        vinNumber: getCorrectVinNumber(
          risk.DTOVehicle[0].VehIdentificationNumber
        ),
        vehNumber: risk.DTOVehicle[0].VehNumber,
        year: risk.DTOVehicle[0].ModelYr,
        make: risk.DTOVehicle[0].Manufacturer,
        model: risk.DTOVehicle[0].Model,
        status: risk.DTOVehicle[0].Status,

        comprehensive: risk.DTOVehicle[0].ComprehensiveDed,
        collisionDeductible: risk.DTOVehicle[0].CollisionDed,
        symbolCode: risk.DTOVehicle[0].SymbolCode,
        dailyRentalCarLimit: risk.DTOVehicle[0].RentalReimbursementInd,
        medicalPartsAndAccessibility:
          risk.DTOVehicle[0].MedicalPartsAccessibility,
        roadsideAssistance: risk.DTOVehicle[0].TowingAndLaborInd === "Yes",
        fullGlass: risk.DTOVehicle[0].FullGlassCovInd === "Yes",
        loanLeaseGap: risk.DTOVehicle[0].LoanLeaseGap === "Yes",
        originalReplacementCost:
          risk.DTOVehicle[0].OriginalEquipmentManufacturer === "Yes",
        waiveLiability: risk.DTOVehicle[0].LiabilityWaiveInd === "Yes",
        parentRiskId: risk.id,

        coverages:
          risk.DTOCoverage?.map((item) => ({
            description: item.Description,
            amount: item.WrittenPremiumAmt,
          })) || [],
      }))
    : [],

  paymentMethod: application.DTOTransactionInfo[0].ElectronicPaymentSource[0]
    ? paymentInfoFormat(
        application.DTOTransactionInfo[0].ElectronicPaymentSource[0]
      )
    : null,

  fees: application.DTOFee
    ? application.DTOFee.map((fee) => ({
        description: fee.Description,
        amount: fee.WrittenAmt,
      })) || []
    : [],
});

export const updateApplicationFromPlan = (
  application: DTOApplication,
  planInfo: PlanInfo
) => {
  application.ApplicationNumber = planInfo.applicationNumber;
  application.DTOBasicPolicy[0].EffectiveDt = convertDateToString(
    planInfo.effectiveDate
  );
  application.DTOBasicPolicy[0].PersistencyDiscountDt = convertDateToString(
    planInfo.effectiveDate
  );
  application.DTOLine[0].BILimit = planInfo.bodilyInjuryLimit;
  application.DTOLine[0].UMBILimit = planInfo.uninsuredMotoristLimit;
  application.DTOLine[0].MedPayLimit = planInfo.medicalPaymentsLimit;
  application.DTOLine[0].UMPDWCDInd = planInfo.UM_PD_WCD_Applies;
  application.DTOLine[0].PDLimit = planInfo.propertyDamage;

  if (application.DTOLine[0].DTORisk) {
    application.DTOLine[0].DTORisk.map((risk, index) => {
      risk.DTOVehicle[0].ComprehensiveDed =
        planInfo.vehicleInfo[index].comprehensive;
      risk.DTOVehicle[0].CollisionDed =
        planInfo.vehicleInfo[index].collisionDeductible;
      risk.DTOVehicle[0].RentalReimbursementInd =
        planInfo.vehicleInfo[index].dailyRentalCarLimit;
      risk.DTOVehicle[0].MedicalPartsAccessibility =
        planInfo.vehicleInfo[index].medicalPartsAndAccessibility;
      risk.DTOVehicle[0].TowingAndLaborInd = planInfo.vehicleInfo[index]
        .roadsideAssistance
        ? "Yes"
        : "No";
      risk.DTOVehicle[0].FullGlassCovInd = planInfo.vehicleInfo[index].fullGlass
        ? "Yes"
        : "No";
      risk.DTOVehicle[0].LoanLeaseGap = planInfo.vehicleInfo[index].loanLeaseGap
        ? "Yes"
        : "No";
      risk.DTOVehicle[0].OriginalEquipmentManufacturer = planInfo.vehicleInfo[
        index
      ].originalReplacementCost
        ? "Yes"
        : "No";
      risk.DTOVehicle[0].LiabilityWaiveInd = planInfo.vehicleInfo[index]
        .waiveLiability
        ? "Yes"
        : "No";
    });
  }

  // Update Payment Info
  application.DTOBasicPolicy[0].PayPlanCd =
    planInfo.paymentPlan === "monthly"
      ? "insured direct bill 5 pay ca sg pa 2.0"
      : "insured direct bill full pay ca sg pa 2.0";
};

// SPINN -> QQ
export const parseQuoteResponse = (
  quoteResponse: QuoteResponse
): QuoteDetail => {
  try {
    const payPlan = quoteResponse.DTOARPayPlan[0];

    const insurer =
      quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo.find(
        (partyInfo) => partyInfo.PartyTypeCd === "InsuredParty"
      );

    return {
      infoReq: quoteResponse.infoReq,
      systemId: quoteResponse.DTOApplication[0].SystemId,
      insurerFirstName: insurer.NameInfo[0].GivenName,
      insurerLastName: insurer.NameInfo[0].Surname,
      insuredAddress: insurer.Addr.find(
        (addr) => addr.AddrTypeCd === "InsuredLookupAddr"
      ),
      customerRef: quoteResponse.DTOApplication[0].CustomerRef,

      vehicles:
        quoteResponse.infoReq ||
        !quoteResponse.DTOApplication[0].DTOLine[0].DTORisk
          ? []
          : quoteResponse.DTOApplication[0].DTOLine[0].DTORisk?.map((risk) =>
              parseRisk(risk)
            ),

      drivers: !quoteResponse.DTOApplication[0].PartyInfo
        ? []
        : quoteResponse.DTOApplication[0].PartyInfo.filter(
            (party) =>
              party.PartyTypeCd === "DriverParty" ||
              party.PartyTypeCd === "NonDriverParty"
          ).map((party) => ({
            id: party.id,
            firstName: party.NameInfo[0].GivenName,
            lastName: party.NameInfo[0].Surname,
            birthDate: convertStringToDate(party.PersonInfo[0].BirthDt),
            originalBirthDate: convertStringToDate(party.PersonInfo[0].BirthDt),
            age: +party.PersonInfo[0].Age,
            gender: party.PersonInfo[0].GenderCd,
            maritalStatus: party.PersonInfo[0].MaritalStatusCd,
            occupation: party.PersonInfo[0].OccupationClassCd,
            licenseState: party.DriverInfo[0].LicensedStateProvCd,
            licenseNumber: party.DriverInfo[0].LicenseNumber,
            relationshipToInsuredCd:
              party.DriverInfo[0].RelationshipToInsuredCd,
            originalLicenseNumber: party.DriverInfo[0].LicenseNumber || "",
            licenseDt: party.DriverInfo[0].LicenseDt || "",
            driverTypeCd: party.DriverInfo[0].DriverTypeCd,
            ageFirstLicensed: +party.DriverInfo[0].AgeFirstLicensed,
            status: party.Status,
            partyTypeCd: party.PartyTypeCd,
            matureDriverInd:
              party.DriverInfo[0].MatureDriverInd &&
              party.DriverInfo[0].MatureDriverInd == "Yes"
                ? true
                : false,
            matureCertificationDt: party.DriverInfo[0].MatureCertificationDt
              ? convertStringToDate(party.DriverInfo[0].MatureCertificationDt)
              : null,
            scholasticDiscountInd:
              party.DriverInfo[0].ScholasticDiscountInd &&
              party.DriverInfo[0].ScholasticDiscountInd == "Yes"
                ? true
                : false,
            scholasticCertificationDt: party.DriverInfo[0]
              .ScholasticCertificationDt
              ? convertStringToDate(
                  party.DriverInfo[0].ScholasticCertificationDt
                )
              : null,
            driverPoints: party.DriverInfo[0].DriverPoints
              ? party.DriverInfo[0].DriverPoints.map((dP) => ({
                  id: dP.id,
                  status: dP.Status,
                  driverPointsNumber: dP.DriverPointsNumber,
                  sourceCd: dP.SourceCd,
                  infractionCd: dP.InfractionCd,
                  infractionDt: dP.InfractionDt
                    ? convertStringToDate(dP.InfractionDt)
                    : undefined,
                  pointsChargeable: dP.PointsChargeable,
                  pointsCharged: dP.PointsCharged,
                  expirationDt: dP.ExpirationDt
                    ? convertStringToDate(dP.ExpirationDt)
                    : undefined,
                  comments: dP.Comments,
                  convictionDt: dP.ConvictionDt
                    ? convertStringToDate(dP.ConvictionDt)
                    : undefined,
                  typeCd: dP.TypeCd,
                  addedByUserId: dP.AddedByUserId,
                  goodDriverPoints: dP.GoodDriverPoints,
                }))
              : [],
          })),

      discounts: quoteResponse.DTOApplication[0].DTOLine[0].Discount
        ? quoteResponse.DTOApplication[0].DTOLine[0].Discount.map(
            (discount) => ({
              applied: discount.AppliedInd || "No",
              description: discount.Description,
              sortOrder: discount.SortOrder,
              id: discount.id,
            })
          ) || []
        : [],

      planDetails: convertApplicationToPlan(
        quoteResponse.DTOApplication[0],
        payPlan,
        "Standard"
      ),

      lineInfo: {
        multiPolicyDiscountInd:
          quoteResponse.DTOApplication[0].DTOLine[0].MultiPolicyDiscountInd,
        relatedPolicyNumber:
          quoteResponse.DTOApplication[0].DTOLine[0].RelatedPolicyNumber,
        multiPolicyDiscount2Ind:
          quoteResponse.DTOApplication[0].DTOLine[0].MultiPolicyDiscount2Ind,
        relatedPolicyNumber2:
          quoteResponse.DTOApplication[0].DTOLine[0].RelatedPolicyNumber2,
      },
      basicPolicyInfo: {
        programInd:
          quoteResponse.DTOApplication[0].DTOBasicPolicy[0].ProgramInd,
        affinityGroupCd:
          quoteResponse.DTOApplication[0].DTOBasicPolicy[0].AffinityGroupCd,
      },
      communicationInfo: {
        email: quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
          .EmailInfo[0].EmailAddr
          ? quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
              .EmailInfo[0].EmailAddr
          : "",
        phone: quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
          .PhoneInfo[0].PhoneNumber
          ? quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
              .PhoneInfo[0].PhoneNumber === "(999) 999-9999"
            ? ""
            : quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
                .PhoneInfo[0].PhoneNumber
          : quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
              .PhoneInfo[0].PhoneNumber === "(999) 999-9999"
          ? ""
          : quoteResponse.DTOApplication[0].DTOInsured[0].PartyInfo[0]
              .PhoneInfo[0].PhoneNumber,
      },

      additionalInterest: quoteResponse.DTOApplication[0].DTOAI
        ? quoteResponse.DTOApplication[0].DTOAI.map((dtoAi) =>
            parseAdditionalInterestDTOtoAI(dtoAi)
          )
        : [],

      lossHistory: quoteResponse.DTOApplication[0].DTOLossHistory
        ? quoteResponse.DTOApplication[0].DTOLossHistory.map((dtoLh) =>
            parseDTOtoLossHistorySingleQuote(dtoLh)
          )
        : [],

      validationError: [
        ...(quoteResponse.DTOApplication[0].ValidationError || []),
        ...(quoteResponse.DTOApplication[0].DTOLine[0].DTORisk
          ? quoteResponse.DTOApplication[0].DTOLine[0].DTORisk?.map(
              (risk) => risk.DTOValidationError || []
            ).reduce((acc, curVal) => acc.concat(curVal), [])
          : []),
      ],

      uwQuestions:
        quoteResponse.DTOApplication[0].QuestionReplies[0].QuestionReply,
    };
  } catch (e) {
    logger(e);
    if (Array.isArray(e)) throw e;
    throw [
      new CustomError(
        CustomErrorType.PARSE_QUOTE_FAIL,
        { errorData: { Message: "parse quote fail" } },
        "parse quote fail"
      ),
    ];
  }
};

// QQ -> SPINN
export const getUpdatedDTOApplication = (
  quoteResponse: QuoteResponse,
  quoteDetail: QuoteDetail
): Array<DTOApplication> => {
  try {
    const result = quoteResponse.DTOApplication;
    result[0].DTOLine[0].DTORisk.forEach((risk, index) => {
      result[0].DTOLine[0].DTORisk[index] = getUpdatedRisk(
        risk,
        quoteDetail.vehicles[index]
      );
    });

    // Update Drivers Info
    let driverIndex = 0;
    result[0].PartyInfo = result[0].PartyInfo.map((party) => {
      if (
        party.PartyTypeCd === "DriverParty" ||
        party.PartyTypeCd === "NonDriverParty"
      ) {
        const age =
          new Date().getFullYear() -
          new Date(quoteDetail.drivers[driverIndex].birthDate).getFullYear();
        const newData = {
          ...party,
          NameInfo: [
            {
              ...party.NameInfo[0],
              GivenName: quoteDetail.drivers[driverIndex].firstName,
              Surname: quoteDetail.drivers[driverIndex].lastName,
            },
          ],
          PersonInfo: [
            {
              ...party.PersonInfo[0],
              BirthDt: convertDateToString(
                quoteDetail.drivers[driverIndex].birthDate
              ),
              GenderCd: quoteDetail.drivers[driverIndex].gender,
              MaritalStatusCd: quoteDetail.drivers[driverIndex].maritalStatus,
              OccupationClassCd: quoteDetail.drivers[driverIndex].occupation,
              Age: age.toString(),
            },
          ],
          DriverInfo: [
            {
              ...party.DriverInfo[0],
              LicensedStateProvCd:
                quoteDetail.drivers[driverIndex].licenseState,
              LicenseNumber:
                quoteDetail.drivers[driverIndex].licenseNumber &&
                !quoteDetail.drivers[driverIndex].licenseNumber.includes("*")
                  ? quoteDetail.drivers[driverIndex].licenseNumber
                  : quoteDetail.drivers[driverIndex].originalLicenseNumber,
              RelationshipToInsuredCd: quoteDetail.drivers[driverIndex]
                .relationshipToInsuredCd
                ? quoteDetail.drivers[driverIndex].relationshipToInsuredCd
                : "Other",
              ScholasticDiscountInd: quoteDetail.drivers[driverIndex]
                .scholasticDiscountInd
                ? "Yes"
                : "No",
              ScholasticCertificationDt:
                quoteDetail.drivers[driverIndex].scholasticDiscountInd &&
                quoteDetail.drivers[driverIndex].scholasticCertificationDt
                  ? convertDateToString(
                      quoteDetail.drivers[driverIndex].scholasticCertificationDt
                    )
                  : "",
              MatureDriverInd: quoteDetail.drivers[driverIndex].matureDriverInd
                ? "Yes"
                : "No",
              MatureCertificationDt:
                quoteDetail.drivers[driverIndex].matureDriverInd &&
                quoteDetail.drivers[driverIndex].matureCertificationDt
                  ? convertDateToString(
                      quoteDetail.drivers[driverIndex].matureCertificationDt
                    )
                  : "",
              AgeFirstLicensed:
                quoteDetail.drivers[driverIndex].ageFirstLicensed,
              DriverTypeCd: quoteDetail.drivers[driverIndex].driverTypeCd
                ? quoteDetail.drivers[driverIndex].driverTypeCd
                : "",
              /*DriverPoints: quoteDetail.drivers[driverIndex].driverPoints
                .filter(dp => dp.driverPointsNumber)
                .map(dP => ({
                  id: dP.id,
                  Status: dP.status,
                  DriverPointsNumber: dP.driverPointsNumber,
                  SourceCd: dP.sourceCd,
                  InfractionCd: dP.infractionCd,
                  InfractionDt: convertDateToString(dP.infractionDt),
                  PointsChargeable: dP.pointsChargeable,
                  PointsCharged: dP.pointsCharged,
                  ExpirationDt: convertDateToString(dP.expirationDt),
                  Comments: dP.comments,
                  ConvictionDt: convertDateToString(dP.convictionDt),
                  TypeCd: dP.typeCd,
                  AddedByUserId: dP.addedByUserId,
                  GoodDriverPoints: dP.goodDriverPoints
                })),*/
            },
          ],
          Status: quoteDetail.drivers[driverIndex].status,
          PartyTypeCd: quoteDetail.drivers[driverIndex].partyTypeCd,
        };
        driverIndex++;
        return newData;
      } else {
        return party;
      }
    });

    // Update Discounts Info
    result[0].DTOLine[0].Discount = result[0].DTOLine[0].Discount.map(
      (discount, index) => ({
        ...discount,
        AppliedInd: quoteDetail.discounts[index].applied,
        Description: quoteDetail.discounts[index].description,
        SortOrder: quoteDetail.discounts[index].sortOrder,
      })
    );

    //LineInfo
    result[0].DTOLine[0].MultiPolicyDiscountInd =
      quoteDetail.lineInfo.multiPolicyDiscountInd;
    result[0].DTOLine[0].RelatedPolicyNumber = quoteDetail.lineInfo
      .multiPolicyDiscountInd
      ? quoteDetail.lineInfo.multiPolicyDiscountInd === "No" ||
        quoteDetail.lineInfo.multiPolicyDiscountInd === ""
        ? ""
        : quoteDetail.lineInfo.relatedPolicyNumber
      : "";

    result[0].DTOLine[0].MultiPolicyDiscount2Ind =
      quoteDetail.lineInfo.multiPolicyDiscount2Ind;
    result[0].DTOLine[0].RelatedPolicyNumber2 = quoteDetail.lineInfo
      .multiPolicyDiscount2Ind
      ? quoteDetail.lineInfo.multiPolicyDiscount2Ind === "No" ||
        quoteDetail.lineInfo.multiPolicyDiscount2Ind === ""
        ? ""
        : quoteDetail.lineInfo.relatedPolicyNumber2
      : "";

    //BasicPolicyInfo
    result[0].DTOBasicPolicy[0].ProgramInd =
      quoteDetail.basicPolicyInfo.programInd;
    result[0].DTOBasicPolicy[0].AffinityGroupCd =
      quoteDetail.basicPolicyInfo.programInd === "Affinity Group"
        ? quoteDetail.basicPolicyInfo.affinityGroupCd
        : "";

    //CommunicationInfo
    result[0].DTOInsured[0].PartyInfo[0].EmailInfo[0].EmailAddr =
      quoteDetail.communicationInfo.email;
    result[0].DTOInsured[0].PartyInfo[0].PhoneInfo[0].PhoneNumber =
      quoteDetail.communicationInfo.phone;

    const additionalInterestDTO = parseAdditionalInterestAItoDTO(
      quoteDetail.additionalInterest
    );
    result[0].DTOAI = additionalInterestDTO;

    result[0].QuestionReplies[0].QuestionReply = quoteDetail.uwQuestions;

    if (quoteDetail.lossHistory) {
      const lossHistoryDTO = parseLossHistorytoDTO(quoteDetail.lossHistory);
      result[0].DTOLossHistory = lossHistoryDTO;
    }

    updateApplicationFromPlan(result[0], quoteDetail.planDetails);

    return handleSSN(result);
  } catch (e) {
    logger(e);
    throw [
      new CustomError(
        CustomErrorType.PARSE_QUOTE_FAIL,
        { errorData: { Message: "parse quote fail" } },
        "parse quote fail"
      ),
    ];
  }
};

export const handleSSN = (quote: any) =>
  JSON.parse(JSON.stringify(quote).split("xxxxxxx").join("999-99-"));

function paymentInfoFormat(dtoPayment: ElectronicPaymentSource) {
  return {
    id: dtoPayment.id,
    sourceTypeCd: dtoPayment.SourceTypeCd,
    paymentCategory: dtoPayment.MethodCd,
    lastFourDigits: dtoPayment.CreditCardNumber
      ? dtoPayment.CreditCardNumber
      : dtoPayment.ACHBankAccountNumber,
    cardType: dtoPayment.CreditCardTypeCd ? dtoPayment.CreditCardTypeCd : "",
    creditCardHolderName: dtoPayment.CreditCardHolderName
      ? dtoPayment.CreditCardHolderName
      : "",
    oneIncPaymentToken: dtoPayment.OneIncPaymentToken,
    accountType: dtoPayment.ACHBankAccountTypeCd
      ? dtoPayment.ACHBankAccountTypeCd
      : "",
    bankName: dtoPayment.ACHBankName ? dtoPayment.ACHBankName : "",
  };
}

function parseSchedulePlan(
  dtoArSchedule: Array<DTOARSchedule>
): Array<PaymentScheduleItem> {
  return dtoArSchedule.map((dtoArSch) => ({
    BillAmt: dtoArSch.BillAmt,
  }));
}

export const parseDriverPoint = (
  action: string,
  driverNumber: string,
  dP: DriverPointsInfo
) => {
  let dpObject = {
    DriverNumber: driverNumber,
    "DriverPoints.InfractionDt": convertDateToString(dP.infractionDt),
    "DriverPoints.InfractionCd": dP.infractionCd,
    "DriverPoints.ConvictionDt": convertDateToString(dP.convictionDt),
    "DriverPoints.TypeCd": dP.typeCd,
    "DriverPoints.SourceCd": dP.sourceCd,
    "DriverPoints.Comments": dP.comments,
  };

  //console.log(action)

  if (action === "add") {
    return { ...dpObject, DriverPointUpdateInd: "No" };
  }

  return {
    ...dpObject,
    DriverPointUpdateInd: "Yes",
    DriverPointsNumber: dP.driverPointsNumber,
  };
};

/*export const driverPointsToDTO = (dP: DriverPointsInfo): any =>   {
  return {
    id: dP.id,
    Status: dP.status,
    DriverPointsNumber: dP.driverPointsNumber,
    SourceCd: dP.sourceCd,
    InfractionCd: dP.infractionCd,
    InfractionDt: convertDateToString(dP.infractionDt),
    PointsChargeable: dP.pointsChargeable,
    PointsCharged: dP.pointsCharged,
    ExpirationDt: convertDateToString(dP.expirationDt),
    Comments: dP.comments,
    ConvictionDt: convertDateToString(dP.convictionDt),
    TypeCd: dP.typeCd,
    AddedByUserId: dP.addedByUserId,
    GoodDriverPoints: dP.goodDriverPoints
  }
}*/
