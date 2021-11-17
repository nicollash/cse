import type { NextPage } from "next";
import parse from "urlencoded-body-parser";
import { getSession } from "~/backend/lib";
import { AuthService } from "~/backend/services";

const Logout: NextPage = () => {
  return <div></div>;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  const { fromLogoutMessage } = await parse(req);

  await AuthService.logout(session);

  session.fromLogoutMessage = fromLogoutMessage;

  console.log("server sesion: ", session);
  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default Logout;
