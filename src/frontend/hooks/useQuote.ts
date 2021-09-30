import { useContext } from 'react'
import QuoteContext from '../contexts/quote-context'

export const useQuote = () => useContext(QuoteContext)
