import { EAddressObjectStatus } from './../../types/address'
import { logger, parseQuoteResponse } from '~/utils'

import { Action, QuoteState } from './types'

export const reducer = (state: QuoteState, action: Action): QuoteState => {
  logger('reducer', state, action)
  try {
    switch (action.type) {
      case 'SetQuote': {
        const { quoteResponse } = action.payload
        const quoteDetail = parseQuoteResponse(quoteResponse)

        return {
          ...state,
          quoteResponse,
          quoteDetail,
          insurer: {
            firstName: quoteDetail.insurerFirstName,
            lastName: quoteDetail.insurerLastName,
            address: {
              address: `${quoteDetail.insuredAddress.Addr1}, ${quoteDetail.insuredAddress.City}, ${quoteDetail.insuredAddress.StateProvCd}`,
              unitNumber: quoteDetail.insuredAddress.Addr2,
              requiredUnitNumber: false,
              status: EAddressObjectStatus.success,
            },
          },
        }
      }

      case 'UpdateQuoteDetail': {
        const { quoteDetail } = action.payload

        return {
          ...state,
          quoteDetail: {
            ...state.quoteDetail,
            ...quoteDetail,
          },
        }
      }

      case 'UpdateSelectedPlan': {
        const { selectedPlan } = action.payload

        return {
          ...state,
          selectedPlan,
        }
      }

      case 'SetSelectedPlan': {
        const { planType } = action.payload

        return {
          ...state,
          selectedPlan: planType,
        }
      }

      case 'SetPolicy': {
        const { policy } = action.payload

        return {
          ...state,
          policy,
        }
      }
    }

    return state
  } catch (e) {
    logger('catched', e)
    return {
      ...state,
      quoteResponse: null,
      quoteDetail: null,
    }
  }
}
