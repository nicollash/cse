import {
  createContext,
  FunctionComponent,
  ReactNode,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { Loading } from "~/components";

import { UserInfo } from "~/types";
import { login, logout, checkToken } from "~/services";
import { showChat, removeChat, logger } from "~/utils";
import { useCookies } from "react-cookie";

// states and initial values

interface AuthState {
  previousLogout: boolean;
  lastAttemptCredentials: {
    userName: string;
    password: string;
  };
}

const initialAuthState: AuthState = {
  previousLogout: false,
  lastAttemptCredentials: {
    userName: "",
    password: "",
  },
};

interface AuthContextValue extends AuthState {
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// action types and reducers

type SetLastCredAction = {
  type: "SetLastCred";
  payload: {
    userName: string;
    password: string;
  };
};

type LogoutAction = {
  type: "Logout";
};

type LogoutSimpleAction = {
  type: "LogoutSimple";
};

type Action = SetLastCredAction | LogoutAction;

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "SetLastCred": {
      const { userName, password } = action.payload;

      return {
        ...state,
        lastAttemptCredentials: {
          userName,
          password,
        },
      };
    }

    case "Logout": {
      return {
        ...state,
        previousLogout: true,
      };
    }
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["cse_cookie_consent"]);

  let firstTime = false;
  let monitorTimer;
  const monitorLoggedIn = async () => {
    monitorTimer = setInterval(function () {
      checkLoggedIn()
        .then((response) => {
          if (response.tokenStatus === "Invalid") {
            //For testing
            clearInterval(monitorTimer);
            handleLogout();
          }
        })
        .catch(() => {});
    }, 20 * 1000);
  };

  const handleLogin = useCallback(async (loginId: string, password: string) => {
    dispatch({
      type: "SetLastCred",
      payload: {
        userName: loginId,
        password,
      },
    });

    try {
      const { conversationId } = await login(loginId, password);

      localStorage.setItem("cse_ConversationId", conversationId);

      showChat(loginId);
      monitorLoggedIn();
    } catch (e) {
      logger("LOGIN ERROR SPEC PENDING");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();

    localStorage.clear();
    removeCookie("cse_cookie_consent");
    removeChat();
    clearInterval(monitorTimer);

    dispatch({
      type: "Logout",
    });

    location.reload();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
