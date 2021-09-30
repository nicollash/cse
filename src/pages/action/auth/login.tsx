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

  session.loginResult = await AuthService.login(session, userId, password);

  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default Login;
