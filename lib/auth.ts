import CryptoJS from 'crypto-js'

/**
 * LEGACY content helpers only.
 *
 * Some public content files (data/reviews.json, data/portfolio.json) were stored
 * "encrypted" with a key that ships to the browser. That is NOT a security measure;
 * these helpers only exist so those files can still be read. New data is stored as
 * plain JSON. Staff authentication lives in lib/session.ts and app/api/auth/*.
 */
const LEGACY_CONTENT_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'techrover-admin-2024'

export const encrypt = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), LEGACY_CONTENT_KEY).toString()
}

export const decrypt = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, LEGACY_CONTENT_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch {
    return null
  }
}
