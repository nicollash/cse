import { ReactNode, createContext } from 'react'

import {
  QuoteDetail,
  QuoteResponse,
  PlanType,
  InsurerInfo,
  DTORisk,
  DriverInfo,
  DTOPolicy,
  OneIncPaymentInfo,
  SavePaymentRequestInfo,
  DriverPointsInfo
} from '~/types'

export interface QuoteState {
  quoteResponse: QuoteResponse | null
  quoteDetail: QuoteDetail | null
  selectedPlan: PlanType | null
  insurer: InsurerInfo | null
  policy: DTOPolicy | null
}

export const initialQuoteState: QuoteState = {
  quoteResponse: null,
  quoteDetail: null,
  selectedPlan: null,
  insurer: null,
  policy: null,
}

export interface QuoteContextValue extends QuoteState {
  generateQuote: (insurer: InsurerInfo) => Promise<any>
  getQuote: (applicationNumber: string) => Promise<any>
  addVehicle: (newRisk: DTORisk) => Promise<any>
  addDriver: (newDriver: any) => Promise<any>
  updateQuote: (newData: QuoteDetail) => Promise<any>
  externalApplicationCloseOut: (newData: QuoteDetail) => Promise<any>
  externalApplicationCloseOutFromReponse: (res: QuoteResponse) => Promise<any>
  updateDownPaymentDetailsPostOneIncSave: (payInfo: SavePaymentRequestInfo) => Promise<any>
  savePaymentInfo: (payInfo: OneIncPaymentInfo) => Promise<any>  
  convertToApplication: () => Promise<any>
  issuePolicy: (paymentAmount: string, paymentFrequency: string) => Promise<any>

  updateQuoteDetail: (newData: Partial<QuoteDetail>) => void
  setSelectedPlan: (planType: PlanType) => void
  getInfractionList: () => Promise<any>
  updateDriverPoints: (action:string, driverNumber:string, newDriverPoint: DriverPointsInfo) => Promise<any>
  shareQuote: (applicationRef: string, emailId: string) => Promise<any>
}

// action types and reducers

type SetQuoteAction = {
  type: 'SetQuote'
  payload: {
    quoteResponse: QuoteResponse
  }
}

type UpdateQuoteDetailAction = {
  type: 'UpdateQuoteDetail'
  payload: {
    quoteDetail: Partial<QuoteDetail>
  }
}

type UpdateSelectedPlanAction = {
  type: 'UpdateSelectedPlan'
  payload: {
    selectedPlan: PlanType
  }
}

type SetSelectedPlanAction = {
  type: 'SetSelectedPlan'
  payload: {
    planType: PlanType
  }
}

type SetPolicyAction = {
  type: 'SetPolicy'
  payload: {
    policy: DTOPolicy
  }
}

export type Action =
  | SetQuoteAction
  | UpdateQuoteDetailAction
  | UpdateSelectedPlanAction
  | SetSelectedPlanAction
  | SetPolicyAction

export interface QuoteProviderProps {
  children: ReactNode
}

export const QuoteContext = createContext<QuoteContextValue>({
  ...initialQuoteState,
  generateQuote: () => Promise.resolve(),
  getQuote: () => Promise.resolve(),
  addVehicle: () => Promise.resolve(),
  addDriver: () => Promise.resolve(),
  updateQuote: () => Promise.resolve(),
  convertToApplication: () => Promise.resolve(),
  issuePolicy: () => Promise.resolve(),
  savePaymentInfo: () => Promise.resolve(),

  externalApplicationCloseOut: () => Promise.resolve(),
  externalApplicationCloseOutFromReponse: ()=> Promise.resolve(),
  updateDownPaymentDetailsPostOneIncSave: () => Promise.resolve(),
  updateQuoteDetail: () => {},
  setSelectedPlan: () => {},
  getInfractionList: () => Promise.resolve(),
  updateDriverPoints: () => Promise.resolve(),
  shareQuote: () => Promise.resolve(),
})
