import { useState, useEffect } from 'react'

export const useAddressDebounce = <T>(
  address: string,
  unitNumber: string,
  isImmediateSelect: boolean | null,
  delay: number,
) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState({
    address,
    unitNumber,
    isImmediate: false,
  })
  const [handler, setHandler] = useState(null)

  useEffect(
    () => {
      // Update debounced value after delay
      if (handler) {
        clearTimeout(handler)
      }

      setHandler(
        setTimeout(() => {
          setDebouncedValue({ address, unitNumber, isImmediate: false })
        }, delay),
      )

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [address, unitNumber, delay], // Only re-call effect if value or delay changes
  )

  useEffect(() => {
    if (
      address !== debouncedValue.address ||
      (unitNumber !== debouncedValue.unitNumber && isImmediateSelect !== null)
    ) {
      setDebouncedValue({ address, unitNumber, isImmediate: true })
      if (handler) {
        clearTimeout(handler)
      }
    }
  }, [isImmediateSelect])

  return debouncedValue
}
