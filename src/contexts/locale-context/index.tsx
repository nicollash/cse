import { createContext, FunctionComponent, ReactNode, useReducer } from 'react'

import languages, { AvailableLanguageType } from '~/locale'

// states and initial values

interface LocaleState {
  locale: AvailableLanguageType
  messages: { [i: string]: any }
}

const initialLocaleState: LocaleState = {
  locale: 'en',
  messages: languages['en'],
}

interface LocaleContextValue extends LocaleState {
  setLocale: (newLocale: AvailableLanguageType) => any
}

// action types and reducers
type Action = {
  type: 'SetLocale'
  payload: {
    locale: 'en' | 'cn'
  }
}

const reducer = (state: LocaleState, action: Action): LocaleState => {
  switch (action.type) {
    case 'SetLocale': {
      const { locale } = action.payload

      return {
        ...state,
        locale,
        messages: languages[locale],
      }
    }
  }
}

interface LocaleProviderProps {
  children: ReactNode
}

const LocaleContext = createContext<LocaleContextValue>({
  ...initialLocaleState,
  setLocale: () => {},
})

export const LocaleProvider: FunctionComponent<LocaleProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialLocaleState)

  return (
    <LocaleContext.Provider
      value={{
        ...state,
        setLocale: (locale) => {
          dispatch({
            type: 'SetLocale',
            payload: {
              locale,
            },
          })
        },
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export default LocaleContext
