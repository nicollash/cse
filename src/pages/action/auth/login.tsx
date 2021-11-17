import type { NextPage } from "next";
import parse from "urlencoded-body-parser";
import { getSession } from "~/backend/lib";
import { AuthService } from "~/backend/services";

const Login: NextPage = (props) => {
  console.log("props", props);
  return <div></div>;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  const { userId, password } = await parse(req);

  const loginResult = await AuthService.login(session, userId, password);

  if (loginResult.success) {
    session.loginError = null;
    session.lastError = null;
  } else {
    session.loginError = loginResult.error;
  }
  session.fromLogoutMessage = null;

  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default Login;
