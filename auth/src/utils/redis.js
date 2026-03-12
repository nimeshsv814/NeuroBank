import { Redis } from "@upstash/redis";
import config from "../configs/config.js";

console.log(config.UPSTASH_REDIS_REST_URL, config.UPSTASH_REDIS_REST_TOKEN);

const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
});

await redis.set("name", "pranjal");

const data = await redis.get("name");

console.log(data);

export default redis;
