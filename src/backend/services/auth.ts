import { config } from "~/config";
import { httpClient } from "~/backend/lib";

class AuthService {
  static async login(session: any, userId: string, password: string) {
    try {
      const userInfo: any = await httpClient(
        `${config.apiBaseURL}/ProviderLoginRq/json`,
        "POST",
        {
          UserId: userId,
          Password: password,
        }
      );

      session.user = { ...userInfo, LoginId: userId };
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async logout(session: any) {
    try {
      if (session.user) {
        await httpClient(
          `${config.apiBaseURL}/LogoutTokenRq/json`,
          "POST",
          {},
          session.user.LoginToken
        );

        session.user = null;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async checkLoginStatus(session: any) {
    try {
      let isLoggedIn = false;
      if (session.user) {
        const tokenInfo: any = await fetch(
          `${config.apiBaseURL}/ValidateProviderLoginTokenRq/json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              LoginToken: session.user.LoginToken,
            }),
          }
        ).then((res) => res.json());

        if (tokenInfo.tokenStatus !== "Invalid") {
          isLoggedIn = true;
        }
      }
      return { success: true, isLoggedIn };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export default AuthService;