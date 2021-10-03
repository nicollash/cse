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
import { decrypt, encrypt } from "~/lib/encryption";

// states and initial values

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  previousLogout: boolean;
  lastAttemptCredentials: {
    userName: string;
    password: string;
  };
}

const initialAuthState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  previousLogout: false,
  user: null,
  lastAttemptCredentials: {
    userName: "",
    password: "",
  },
};

interface AuthContextValue extends AuthState {
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutSimple: () => Promise<void>;
}

// action types and reducers

type InitializeAction = {
  type: "Initialize";
  payload: {
    isAuthenticated: boolean;
    user: UserInfo | null;
  };
};

type LoginAction = {
  type: "Login";
  payload: {
    user: UserInfo;
  };
};

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

type Action =
  | InitializeAction
  | LoginAction
  | SetLastCredAction
  | LogoutAction
  | LogoutSimpleAction;

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "Initialize": {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user,
      };
    }

    case "Login": {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }

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
        isAuthenticated: false,
        previousLogout: true,
        user: null,
      };
    }

    case "LogoutSimple": {
      return {
        ...state,
        isAuthenticated: false,
        previousLogout: true,
        user: null,
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
  logoutSimple: () => Promise.resolve(),
});

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["cse_cookie_consent"]);

  let firstTime = false;
  let verifyLoginToken;
  const enableTokenListener = async () => {
    verifyLoginToken = setInterval(function () {
      if (!firstTime) {
        const token = decrypt(localStorage.getItem("cse_token"));
        if (token) {
          checkToken(token)
            .then((response) => {
              if (response.tokenStatus === "Invalid") {
                //For testing
                clearInterval(verifyLoginToken);
                handleLogoutSimple();
              }
            })
            .catch(() => {});
        } else {
          clearInterval(verifyLoginToken);
          handleLogoutSimple();
        }
      }
      firstTime = false;
    }, 20 * 1000);
  };

  useEffect(() => {
    (async () => {
      const token = decrypt(localStorage.getItem("cse_token"));

      try {
        if (token && !state.isInitialized) {
          const loginId = decrypt(localStorage.getItem("cse_loginId"));

          const res = await checkToken(token);
          if (res.tokenStatus === "Invalid") {
            throw new Error("Token is Invalid");
          } else {
            const { LoginToken } = res;
            const ProviderLogin = JSON.parse(
              decrypt(localStorage.getItem("cse_ProviderLogin"))
            );
            const DTOProvider = JSON.parse(
              decrypt(localStorage.getItem("cse_DTOProvider"))
            );

            //INCONTACT CHAT
            showChat(loginId);

            enableTokenListener();

            dispatch({
              type: "Initialize",
              payload: {
                isAuthenticated: true,
                user: {
                  LoginToken,
                  ProviderLogin: ProviderLogin[0],
                  DTOProvider: DTOProvider[0],
                  LoginId: loginId,
                },
              },
            });
          }
        } else {
          throw new Error("Token Not Found");
        }
      } catch (e) {
        localStorage.clear();
        dispatch({
          type: "Initialize",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    })();
  }, []);

  const handleLogin = useCallback(async (loginId: string, password: string) => {
    console.log('login', loginId, password);
    dispatch({
      type: "SetLastCred",
      payload: {
        userName: loginId,
        password,
      },
    });

    await login(loginId, password)
      .then((res) => {
        const { LoginToken, ProviderLogin, DTOProvider, ResponseParams } = res;

        localStorage.setItem(
          "cse_ConversationId",
          encrypt(ResponseParams[0].ConversationId)
        );
        localStorage.setItem("cse_token", encrypt(LoginToken));
        localStorage.setItem("cse_loginId", encrypt(loginId));
        localStorage.setItem(
          "cse_ProviderLogin",
          encrypt(JSON.stringify(ProviderLogin))
        );
        localStorage.setItem(
          "cse_DTOProvider",
          encrypt(JSON.stringify(DTOProvider))
        );

        //INCONTACT CHAT
        showChat(loginId);

        //VerifyToken
        enableTokenListener();

        dispatch({
          type: "Login",
          payload: {
            user: {
              LoginToken,
              ProviderLogin: ProviderLogin[0],
              DTOProvider: DTOProvider[0],
              LoginId: loginId,
            },
          },
        });
      })
      .catch((e) => {
        logger("LOGIN ERROR SPEC PENDING");
      });
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();

    localStorage.clear();

    removeCookie("cse_cookie_consent");

    removeChat();

    clearInterval(verifyLoginToken);

    location.reload();

    dispatch({
      type: "Logout",
    });
  }, []);

  const handleLogoutSimple = useCallback(async () => {
    localStorage.removeItem("cse_token");
    localStorage.removeItem("cse_loginId");

    removeCookie("cse_cookie_consent");

    removeChat();

    location.reload();

    dispatch({
      type: "LogoutSimple",
    });
  }, []);

  if (!state.isInitialized) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        logout: handleLogout,
        logoutSimple: handleLogoutSimple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
