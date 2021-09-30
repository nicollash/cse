import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/quote");
  }, []);

  return <div>Welcome!</div>;
};

export default Home;
