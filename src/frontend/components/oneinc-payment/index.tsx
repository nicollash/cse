import React, { forwardRef, useLayoutEffect } from 'react'
import { config } from '~/config'
import { useError } from '~/frontend/hooks'
import { CustomError, CustomErrorType, OneIncPaymentInfo } from '~/types'
import { loadScript } from '~/frontend/utils'

export const OneIncPayment = forwardRef<
  any,
  { quoteNumber: string; onSaveComplete: (data: OneIncPaymentInfo) => any }
>(({ quoteNumber, onSaveComplete }, ref) => {
  const { setError } = useError()

  useLayoutEffect(() => {
    loadScript('oneIncPaymentScriptLoader', config.oneIncPaymentLib, () => {
      const ref = (window as any).$('#portalOneContainer')
      if (typeof ref.portalOne === 'function') {
        ref.portalOne()
        ref.on('portalOne.saveComplete', (_e: any, data: OneIncPaymentInfo) => {
          onSaveComplete(data)
        })
      } else {
        setError([
          new CustomError(
            CustomErrorType.PAYMENT_ERROR,
            {
              quoteNumber,
            },
            `The country you're trying to make a payment from is not authorized. Please contact customer services at ${config.constants.phoneNumber}`,
          )]
        )
      }
    })
  }, [])

  return <div id="portalOneContainer" ref={ref}></div>
})
