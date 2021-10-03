import type { NextPage } from "next";
import { getSession } from "~/backend/lib";
import { AuthService } from "~/backend/services";

const Logout: NextPage = () => {
  return <div></div>;
};

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);

  await AuthService.logout(session);

  return {
    redirect: {
      destination: "/quote",
    },
  };
}
export default Logout;
