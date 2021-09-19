import { config } from '~/config'
import { parseQuoteResponse } from './../../../utils/mapping'
import { getUpdatedDTOApplication, handleSSN, parseDriverPoint } from '../../../utils/mapping/single-quote/application'
import { Dispatch } from 'react'

import {
  InsurerInfo,
  UserInfo,
  DTOApplication,
  DTORisk,
  QuoteDetail,
  QuoteResponse,
  OneIncPaymentInfo,
  SavePaymentRequestInfo,
  DriverPointsInfo,
  CustomError,
  CustomErrorType,
} from '~/types'
import {
  addDriver,
  addVehicle,
  generateQuote,
  getQuote,
  issuePolicy,
  updateQuote,
  externalApplicationCloseOut,
  updateDownPaymentDetailsPostOneIncSave,
  convertQuoteToApplication,
  getInfractionList,
  updateDriverPoints,
  shareQuote,
} from '~/services'
import { explodeAddress, httpClient, logger } from '~/utils'
import { Action } from './../types'

export const handleGenerateQuote = async (
  params: InsurerInfo,
  user: UserInfo,
  dispatch: Dispatch<Action>,
) => {
  logger('Generate Quote', params)

  const addressObj = await new Promise<any>((resolve) =>
    explodeAddress(params.address.address, (err: any, addressObj) => {
      resolve(addressObj)
    }),
  )

  const addressInfo = await httpClient(
    `${config.apiBaseURL}/ValidateAddressRq/json`,
    'POST',
    {
      Address1: addressObj.street_address1,
      Address2: params.address.unitNumber,
      City: addressObj.city,
      State: addressObj.state,
      PostalCode: addressObj.postal_code,
    },
  ).then((res: any) => {
    return res.JsonValidatedAddress[0].Address
  })

  const res = await generateQuote({
    FirstName: params.firstName,
    LastName: params.lastName,
    Addr1: addressObj.street_address1,
    Addr2: params.address.unitNumber
      ? `${addressInfo.FragmentUnit} #${addressInfo.FragmentUnitNumber}`
      : null,
    City: addressObj.city,
    StateProvCd: addressObj.state,
    PostalCode: addressObj.postal_code,
    ProviderNumber: user.DTOProvider.ProviderNumber,
    LoginId: user.LoginId,
  })

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })

  return res
}

export const handleGetQuote = async (
  applicationNumber: string,
  user: UserInfo,
  dispatch: Dispatch<Action>,
) => {
  logger('Get Quote', applicationNumber, user.LoginId)
  if (user) {
    const res = await getQuote(applicationNumber, user.LoginId)

    dispatch({
      type: 'SetQuote',
      payload: {
        quoteResponse: res,
      },
    })

    return res
  }
  return null
}

export const handleUpdateQuote = async (
  newQuote: QuoteDetail,
  user: UserInfo,
  quoteResponse: QuoteResponse,
  dispatch: Dispatch<Action>,
) => {
  logger('Update Quote', newQuote)

  const res = await updateQuote(
    user.LoginId,
    getUpdatedDTOApplication(quoteResponse, newQuote),
  )

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleExternalApplicationCloseOut = async (
  newQuote: QuoteDetail,
  user: UserInfo,
  quoteResponse: QuoteResponse,
  dispatch: Dispatch<Action>,
) => {
  const res = await externalApplicationCloseOut(
    user.LoginId,
    getUpdatedDTOApplication(quoteResponse, newQuote)[0],
  )

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleExternalApplicationCloseOutFromReponse = async (
  user: UserInfo,
  quoteResponse: QuoteResponse,
  dispatch: Dispatch<Action>,
) => {
  const res = await externalApplicationCloseOut(
    user.LoginId,
    handleSSN(quoteResponse.DTOApplication)[0]
  )

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleUpdateDownPaymentDetailsPostOneIncSave = async (
  user: UserInfo,
  paymentInfo: SavePaymentRequestInfo,
  quoteResponse: QuoteResponse,
  dispatch: Dispatch<Action>,
) => {
  logger('handleUpdateDownPaymentDetailsPostOneIncSave', paymentInfo)

  const res = await updateDownPaymentDetailsPostOneIncSave(
    user.LoginId,
    handleSSN(quoteResponse.DTOApplication),
    paymentInfo
  )

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleSavePaymentInfoInApplication = async (
  paymentInfo: OneIncPaymentInfo,
  user: UserInfo,
  quoteResponse: QuoteResponse,
  dispatch: Dispatch<Action>,
) => {
  logger('Save Payment Info In Application', paymentInfo)

  //const res = await updateDownPaymentDetailsPostOneIncSave(
  const res = await updateQuote(
    user.LoginId,
    handleSSN(
      quoteResponse.DTOApplication.map((application) => ({
        ...application,
        DTOTransactionInfo: [
          {
            ...(application.DTOTransactionInfo[0] || {}),
            PaymentAmt: application.DTOBasicPolicy[0].FullTermAmt,
            PaymentTypeCd: 'Cash',

            ElectronicPaymentSource: [
              {
                ...((
                  application.DTOTransactionInfo[0] || { ElectronicPaymentSource: [{}] }
                ).ElectronicPaymentSource[0] || {}),
                oneIncPaymentToken: paymentInfo.tokenId,
              },
            ],
          },
        ],
      })),
    ),
  )

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleAddVehicle = async (
  newRisk: DTORisk,
  DTOApplication: DTOApplication[],
  dispatch: Dispatch<Action>,
) => {
  logger('Add Vehicle', newRisk)

  const res = await addVehicle(newRisk, handleSSN(DTOApplication))

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleAddDriver = async (
  newDriver: any,
  DTOApplication: DTOApplication[],
  dispatch: Dispatch<Action>,
) => {
  logger('Add Driver', newDriver)

  const res = await addDriver(newDriver, handleSSN(DTOApplication))

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleUpdateDriverPoints = async (
  action: string,
  driverNumber: string,
  user: UserInfo,
  driverPoint: DriverPointsInfo,
  DTOApplication: Array<DTOApplication>,
  dispatch: Dispatch<Action>,
) => {

  const res = await updateDriverPoints(user.LoginId, parseDriverPoint(action, driverNumber, driverPoint), handleSSN(DTOApplication))

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })
}

export const handleConvertToApplication = async (
  user: UserInfo,
  DTOApplication: DTOApplication[],
  dispatch: Dispatch<Action>,
) => {
  logger('Issue Policy', DTOApplication)

  const res = await convertQuoteToApplication(user.LoginId, handleSSN(DTOApplication))

  const updatedApplication = res.DTOApplication[0]

  dispatch({
    type: 'SetQuote',
    payload: {
      quoteResponse: res,
    },
  })

  return {
    applicationNumber: updatedApplication.ApplicationNumber,
    isPremiumUpdated:
      updatedApplication.DTOLine[0].WrittenPremiumAmt !==
      DTOApplication[0].DTOLine[0].WrittenPremiumAmt,
    result: parseQuoteResponse(res),
  }
}

export const handleIssuePolicy = async (
  user: UserInfo,
  downPayment: string,
  paymentFrequency: string,
  DTOApplication: DTOApplication[],
  dispatch: Dispatch<Action>,
) => {
  logger('Issue Policy', DTOApplication)

  const res = await issuePolicy(user.LoginId, DTOApplication.map((app) => ({
    ...app,
    DTOBasicPolicy: [
      {
        ...app.DTOBasicPolicy[0],
        PayPlanCd: paymentFrequency === 'monthly' ? 'insured direct bill 5 pay ca sg pa 2.0' : 'insured direct bill full pay ca sg pa 2.0'
      }
    ],
    DTOTransactionInfo: [
      {
        ...(app.DTOTransactionInfo[0] || {}),
        PaymentAmt: downPayment,
      }
    ]
  })))

  if (res.Policy) {
    dispatch({
      type: 'SetPolicy',
      payload: {
        policy: res.Policy[0],
      },
    })
  } else {
    throw [new CustomError(CustomErrorType.ERROR_RESPONSE)]
  }
}

export const handleGetInfractionList = async (
  user: UserInfo,
  DTOApplication: DTOApplication[],
) => {
  const res = await getInfractionList(user.LoginId, handleSSN(DTOApplication))
  return res
}

export const handleShareQuote = async (
  applicationRef: string,
  emailId: string,
  user: UserInfo,
) => {
  logger('Share Quote', applicationRef, user.LoginId, emailId)
  const res = await shareQuote(user.LoginId, emailId, applicationRef)
  return res
}