import { config } from "~/config";
import { HttpService } from "~/backend/lib";

const AuthService = {
  async login(session: any, userId: string, password: string) {
    try {
      const userInfo: any = await HttpService.request(
        `${config.apiBaseURL}/ProviderLoginRq/json`,
        "POST",
        {
          UserId: userId,
          Password: password,
        }
      );
      session.user = { ...userInfo, LoginId: userId };
      await session.commit();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  async logout(session: any) {
    try {
      if (session.user) {
        await HttpService.request(
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
  },

  async checkLoginStatus(session: any) {
    try {
      let isLoggedIn = false;
      if (session.user) {
        const tokenInfo: any = await HttpService.request(
          `${config.apiBaseURL}/ValidateProviderLoginTokenRq/json`,
          "POST",
          {
            LoginToken: session.user.LoginToken,
          }
        );

        if (tokenInfo.tokenStatus === "Invalid") {
          session.user = null;
        } else {
          isLoggedIn = true;
        }
      }
      return { success: true, isLoggedIn };
    } catch (error) {
      return { success: false, error };
    }
  },
};

export default AuthService;
