import { Redis } from '@upstash/redis'

// This ensures Redis client is only created once in server components
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export default redis 