import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useRouter } from "next/router";
import { ErrorModal } from "~/frontend/screens/modals";
import { CustomError, CustomErrorType } from "~/types";

// states and initial values

interface ErrorState {
  error: Array<CustomError>;
}

const initialErrorState: ErrorState = {
  error: null,
};

interface ErrorContextValue extends ErrorState {
  setError: (newError: Array<CustomError>) => any;
}

// action types and reducers
type Action = {
  type: "SetError";
  payload: {
    error: Array<CustomError>;
  };
};

const reducer = (state: ErrorState, action: Action): ErrorState => {
  switch (action.type) {
    case "SetError": {
      const { error } = action.payload;

      return {
        ...state,
        error,
      };
    }
  }
};

interface ErrorProviderProps {
  children: ReactNode;
}

const ErrorContext = createContext<ErrorContextValue>({
  ...initialErrorState,
  setError: () => {},
});

export const ErrorProvider: FunctionComponent<ErrorProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialErrorState);
  const router = useRouter();
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (
      state &&
      state.error != null &&
      state.error.some((er) => er.errorType === CustomErrorType.SESSION_EXPIRED)
    ) {
      logout();
    } else {
      if (state.error) {
        setShowErrorModal(true);
      }
    }
  }, [state]);

  if (showErrorModal) {
    return (
      <ErrorModal
        error={state.error}
        onGoHome={() => {
          /*dispatch({
            type: 'SetError',
            payload: {
              error: null,
            },
          })*/
          setShowErrorModal(false);
          router.push("/quote");
        }}
        onClose={() => {
          /*
          dispatch({
            type: 'SetError',
            payload: {
              error: null,
            },
          })*/
          setShowErrorModal(false);
        }}
      />
    );
  }

  return (
    <ErrorContext.Provider
      value={{
        ...state,
        setError: (error) => {
          dispatch({
            type: "SetError",
            payload: {
              error,
            },
          });
        },
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;

export const isAKnownError = (errors: Array<CustomError>) => {
  return errors.some(
    (error: CustomError) =>
      error.errorData.Message === "At least one active vehicle is required "
  );
};
