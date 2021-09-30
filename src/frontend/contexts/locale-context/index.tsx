import {
  createContext,
  FunctionComponent,
  ReactNode,
  useReducer,
  useEffect,
} from "react";

import languages from "~/locale";

// states and initial values

interface LocaleState {
  locale: string;
  messages: { [i: string]: any };
}

const initialLocaleState: LocaleState = {
  locale: "en",
  messages: languages["en"],
};

interface LocaleContextValue extends LocaleState {
  setLocale: (newLocale: string) => any;
}

// action types and reducers
type Action = {
  type: "SetLocale";
  payload: {
    locale: string;
  };
};

const reducer = (state: LocaleState, action: Action): LocaleState => {
  switch (action.type) {
    case "SetLocale": {
      const { locale } = action.payload;

      return {
        ...state,
        locale,
        messages: languages[locale],
      };
    }
  }
};

interface LocaleProviderProps {
  children: ReactNode;
}

const LocaleContext = createContext<LocaleContextValue>({
  ...initialLocaleState,
  setLocale: () => {},
});

export const LocaleProvider: FunctionComponent<LocaleProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialLocaleState);

  useEffect(() => {
    const locale = localStorage.getItem("cse_locale");

    if (locale) {
      dispatch({
        type: "SetLocale",
        payload: {
          locale,
        },
      });
    }
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        ...state,
        setLocale: (locale) => {
          if (window) {
            localStorage.setItem("cse_locale", locale);
          }
          dispatch({
            type: "SetLocale",
            payload: {
              locale,
            },
          });
        },
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleContext;
