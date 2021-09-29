import { httpClient } from "~/utils";

export const login = (userId: string, password: string): Promise<any> => {
  if (window) {
    localStorage.setItem("cse_userId", userId);
  }
  return httpClient(`/api/auth/login`, "POST", {
    UserId: userId,
    Password: password,
  }).then((res: any) => {
    if (res.success && window) {
      window.location.reload();
    }
    return res;
  });
};

export const logout = () => {
  if (window) {
    localStorage.clear();
  }
  return httpClient(`/api/auth/logout`, "POST").then((res: any) => {
    if (res.success && window) {
      window.location.reload();
    }
    return res;
  });
};

export const checkLoggedIn = () => httpClient(`/api/auth/status`);
