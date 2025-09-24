// Shared API type definitions for client-server communication

export interface ProductInfo {
  productId: string
  title: string
  description: string
  productType: string
  price: {
    currency: string
    current: string
    original: string
    savings: string
    dynamicOriginalPrice: string
  }
  action: {
    action: string
    actionText: string
    behaviorTag: number
    disabled: boolean
  }
  licenseInfo: {
    type: string
    duration: string
    features: string
    support: string
  }
}

export interface DownloadResponse {
  success: boolean
  message?: string
  error?: string
}

export interface LocationData {
  country: string
  city: string
  region?: string
  isp: string
  timezone?: string
}

export interface UserAnalytics {
  ip: string
  userAgent: string
  referrer: string
  location: LocationData
  device: {
    type: string
    browser: string
    platform: string
  }
  timestamp: Date
}

export interface TelegramConfig {
  botToken: string | null
  chatId: string | null
}

export interface AppConfig {
  port: number
  host: string
  nodeEnv: 'development' | 'production' | 'test'
  telegram: TelegramConfig
  blockLinux: boolean
}