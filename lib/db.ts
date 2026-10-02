import mongoose from 'mongoose'

/**
 * Shared MongoDB connection (cached across hot reloads and serverless invocations).
 * Set MONGODB_URI in .env.local / Vercel project settings.
 */
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

const globalForMongoose = globalThis as unknown as { __mongoose?: Cache }
const cache: Cache = globalForMongoose.__mongoose ?? { conn: null, promise: null }
globalForMongoose.__mongoose = cache

export async function connectDB() {
  if (cache.conn) return cache.conn
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to .env.local (and to Vercel environment variables).')
  }
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'techrover',
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    })
  }
  try {
    cache.conn = await cache.promise
  } catch (err) {
    cache.promise = null
    throw err
  }
  return cache.conn
}
