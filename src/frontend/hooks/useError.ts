import { useContext } from 'react'
import ErrorContext from '../contexts/error-context'

export const useError = () => useContext(ErrorContext)
