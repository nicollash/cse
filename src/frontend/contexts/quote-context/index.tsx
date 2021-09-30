import { FunctionComponent, useReducer, useCallback } from 'react'
import LogRocket from 'logrocket'

import { useAuth } from '~/frontend/hooks'
import {
  DriverPointsInfo,
  DTORisk,
  InsurerInfo,
  OneIncPaymentInfo,
  PlanType,
  QuoteDetail,
  QuoteResponse,
  SavePaymentRequestInfo,
} from '~/types'
import { logger } from '~/frontend/utils'

import {
  handleGenerateQuote as generateQuote,
  handleGetQuote as getQuote,
  handleAddVehicle as addVehicle,
  handleAddDriver as addDriver,
  handleUpdateQuote as updateQuote,
  handleConvertToApplication as convertToApplication,
  handleIssuePolicy as issuePolicy,
  handleSavePaymentInfoInApplication as savePaymentInfo,
  handleExternalApplicationCloseOut as externalApplicationCloseOut,
  handleExternalApplicationCloseOutFromReponse as externalApplicationCloseOutFromReponse,
  handleUpdateDownPaymentDetailsPostOneIncSave as updateDownPaymentDetailsPostOneIncSave,
  handleGetInfractionList as getInfractionList,
  handleUpdateDriverPoints as updateDriverPoints,
  handleShareQuote as shareQuote,
} from './handlers'
import { reducer } from './reducer'
import { initialQuoteState, QuoteContext, QuoteProviderProps } from './types'

export const QuoteProvider: FunctionComponent<QuoteProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialQuoteState)
  const { user } = useAuth()

  const handleGenerateQuote = useCallback(
    async (params: InsurerInfo) => {
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV === 'production') {
        LogRocket.identify(`${params.firstName} ${params.lastName}`, {
          name: `${params.firstName} ${params.lastName}`,
          address: params.address.address,
        })
      }

      return await generateQuote(params, user, dispatch)
    },
    [dispatch, user],
  )

  const handleGetQuote = useCallback(
    async (applicationNumber: string) => {
      logger(state)
      return await getQuote(applicationNumber, user, dispatch)
    },
    [user, dispatch],
  )

  const handleAddVehicle = useCallback(
    async (newRisk: DTORisk) => {
      await addVehicle(newRisk, state.quoteResponse.DTOApplication, dispatch)
    },
    [state, dispatch],
  )

  const handleAddDriver = useCallback(
    async (newDriver: any) => {
      await addDriver(newDriver, state.quoteResponse.DTOApplication, dispatch)
    },
    [state, dispatch],
  )

  const handleUpdateDriverPoints = useCallback(
    async (driverPointNumer: string, driverNumber: string, newDriverPoint: DriverPointsInfo) => {
      await updateDriverPoints(driverPointNumer, driverNumber, user, newDriverPoint, state.quoteResponse.DTOApplication, dispatch)
    },
    [state, dispatch])


  const handleUpdateQuote = useCallback(
    async (newData: QuoteDetail) => {
      await updateQuote(newData, user, state.quoteResponse, dispatch)
    },
    [state, dispatch],
  )

  const handleUpdateDownPaymentDetailsPostOneIncSave = useCallback(
    async (paymentData: SavePaymentRequestInfo) => {
      await updateDownPaymentDetailsPostOneIncSave(user, paymentData, state.quoteResponse, dispatch)
    },
    [state, dispatch],
  )

  const handleSavePaymentInfo = useCallback(
    async (paymentInfo: OneIncPaymentInfo) => {
      await savePaymentInfo(paymentInfo, user, state.quoteResponse, dispatch)
    },
    [state, dispatch],
  )

  const handleExternalApplicationCloseOut = useCallback(
    async (newData: QuoteDetail) => {
      await externalApplicationCloseOut(newData, user, state.quoteResponse, dispatch)
    },
    [state, dispatch],
  )

  const handleExternalApplicationCloseOutFromReponse = useCallback(
    async (res: QuoteResponse) => {
      await externalApplicationCloseOutFromReponse(user, res, dispatch)

      dispatch({
        type: 'UpdateQuoteDetail',
        payload: {
          quoteDetail: res,
        },
      })
    },
    [state, dispatch],
  )

  const handleConvertToApplication = useCallback(async () => {
    return await convertToApplication(
      user,
      state.quoteResponse.DTOApplication.filter(
        (application) =>
          application.ApplicationNumber ===
          state.quoteDetail.planDetails.applicationNumber,
      ),
      dispatch,
    )
  }, [state, dispatch])

  const handleUpdateQuoteDetail = useCallback(
    (newData: Partial<QuoteDetail>) => {
      dispatch({
        type: 'UpdateQuoteDetail',
        payload: {
          quoteDetail: newData,
        },
      })
    },
    [dispatch],
  )

  const handleSetSelectedPlan = useCallback(
    (newPlan: PlanType) => {
      dispatch({
        type: 'SetSelectedPlan',
        payload: {
          planType: newPlan,
        },
      })
    },
    [dispatch],
  )

  const handleIssuePolicy = useCallback(async (paymentAmount: string, paymentFrequency: string) => {
    await issuePolicy(
      user,
      paymentAmount,
      paymentFrequency,
      state.quoteResponse.DTOApplication.filter(
        (application) =>
          application.ApplicationNumber ===
          state.quoteDetail.planDetails.applicationNumber,
      ),
      dispatch,
    )
  }, [state, dispatch])

  const handleGetInfractionList = useCallback(async () => {
    return await getInfractionList(
      user,
      state.quoteResponse.DTOApplication.filter(
        (application) =>
          application.ApplicationNumber ===
          state.quoteDetail.planDetails.applicationNumber,
      ),
    )
  }, [state, dispatch])

  const handleShareQuote = useCallback(async (applicationRef: string, email: string) => {
    return await shareQuote(
      applicationRef,
      email,
      user
    )
  }, [state, dispatch])

  return (
    <QuoteContext.Provider
      value={{
        ...state,

        generateQuote: handleGenerateQuote,
        getQuote: handleGetQuote,
        addVehicle: handleAddVehicle,
        addDriver: handleAddDriver,
        updateQuote: handleUpdateQuote,
        convertToApplication: handleConvertToApplication,
        savePaymentInfo: handleSavePaymentInfo,
        externalApplicationCloseOut: handleExternalApplicationCloseOut,
        externalApplicationCloseOutFromReponse: handleExternalApplicationCloseOutFromReponse,
        updateDownPaymentDetailsPostOneIncSave: handleUpdateDownPaymentDetailsPostOneIncSave,
        updateQuoteDetail: handleUpdateQuoteDetail,
        setSelectedPlan: handleSetSelectedPlan,
        issuePolicy: handleIssuePolicy,
        getInfractionList: handleGetInfractionList,
        updateDriverPoints: handleUpdateDriverPoints,
        shareQuote: handleShareQuote
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export default QuoteContext
