import nextSession from "next-session";

import { expressSession, promisifyStore } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";
import redis from "redis";

const RedisStore = RedisStoreFactory(expressSession);
const redisClient = redis.createClient();

const redisStore = new RedisStore({ client: redisClient });

export const getSession = nextSession({
  store: promisifyStore(redisStore),
});
