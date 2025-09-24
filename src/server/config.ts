import { AppConfig } from '../types/api'

export function createConfig(): AppConfig {
  // Environment validation and configuration
  const config: AppConfig = {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN || null,
      chatId: process.env.TELEGRAM_CHAT_ID || null
    }
  }

  // Validate required dependencies
  if (!config.port || isNaN(config.port)) {
    console.error('❌ Invalid PORT configuration. Using default: 3001')
    config.port = 3001
  }

  // Log configuration status
  console.log('🔧 Configuration loaded:')
  console.log(`   📍 Environment: ${config.nodeEnv}`)
  console.log(`   🌐 Port: ${config.port}`)
  console.log(`   🔗 Host: ${config.host}`)
  console.log(`   📱 Telegram: ${config.telegram.botToken ? '✅ Enabled' : '⚠️ Disabled'}`)

  return config
}

export { AppConfig }