import { useContext } from 'react'
import QuoteContext from '../contexts/quote-context/single-quote'

export const useQuote = () => useContext(QuoteContext)
