import nextSession from "next-session";

import { expressSession } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";

const RedisStore = RedisStoreFactory(expressSession);

export const getSession = nextSession({
  store: RedisStore
});
