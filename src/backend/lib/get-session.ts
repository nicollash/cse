import nextSession from "next-session";

import { expressSession, promisifyStore } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";
import redis from "redis";

const RedisStore = RedisStoreFactory(expressSession);
const redisClient = redis.createClient({ url: process.env.REDIS_SERVER });

const redisStore = new RedisStore({ client: redisClient });

export const getSession = nextSession();
