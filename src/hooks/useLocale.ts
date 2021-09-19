import { useContext } from 'react'
import LocaleContext from '../contexts/locale-context'

export const useLocale = () => useContext(LocaleContext)
