import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'techrover-admin-2024'
const ADMIN_CREDENTIALS = {
  username: 'admin@techrover.com',
  password: 'TechRover@2025!'
}

export const encrypt = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

export const decrypt = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch {
    return null
  }
}

export const validateCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export const generateToken = (): string => {
  const payload = {
    user: ADMIN_CREDENTIALS.username,
    timestamp: Date.now(),
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  return encrypt(payload)
}

export const validateToken = (token: string): boolean => {
  const payload = decrypt(token)
  if (!payload) return false
  
  return payload.user === ADMIN_CREDENTIALS.username && payload.expires > Date.now()
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('admin_token', token)
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token')
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('admin_token')
}