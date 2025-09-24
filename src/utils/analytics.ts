import { Request } from 'express'
import { UAParser } from 'ua-parser-js'
import axios from 'axios'
import { LocationData, UserAnalytics } from '../types/api'

export class AnalyticsService {
  /**
   * Extract client IP address from request headers with proper forwarded header parsing
   */
  static getClientIP(req: Request): string {
    // Parse x-forwarded-for to get the first (original) IP
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string') {
      const firstIP = forwarded.split(',')[0].trim()
      if (firstIP && firstIP !== 'unknown') {
        return firstIP
      }
    }
    
    return (req.headers['x-real-ip'] as string) ||
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           req.ip ||
           'Unknown'
  }

  /**
   * Get geolocation data for IP address
   */
  static async getLocationData(ip: string): Promise<LocationData> {
    try {
      // Skip geolocation for localhost/private IPs
      if (this.isPrivateIP(ip)) {
        return { country: 'Local Network', city: 'Localhost', isp: 'Local' }
      }
      
      // Use IP-API.com (free, no API key required, 45 requests/minute)
      const response = await axios.get(
        `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,isp,org,timezone`,
        { timeout: 3000 }
      )
      
      if (response.data && response.data.status === 'success') {
        return {
          country: response.data.country || 'Unknown',
          city: response.data.city || 'Unknown',
          region: response.data.regionName || '',
          isp: response.data.isp || 'Unknown',
          timezone: response.data.timezone || 'Unknown'
        }
      }
    } catch (error: any) {
      console.log('⚠️ Geolocation lookup failed:', error.message)
    }
    
    return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' }
  }

  /**
   * Parse user agent and extract device information
   */
  static parseUserAgent(userAgent: string) {
    // Create parser instance with user agent
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const device = parser.getDevice()
    
    // Format platform with real detection
    const platformName = os.name || 'Unknown OS'
    const platformVersion = os.version ? ` ${os.version}` : ''
    const platform = `${platformName}${platformVersion}`
    
    // Format browser with real detection
    const browserName = browser.name || 'Unknown Browser'
    const browserVersion = browser.version ? ` ${browser.version}` : ''
    const browserInfo = `${browserName}${browserVersion}`
    
    // Format device type
    const deviceType = device.type || os.name || platformName

    return {
      platform,
      browser: browserInfo,
      type: deviceType,
      raw: { browser, os, device }
    }
  }

  /**
   * Generate comprehensive user analytics
   */
  static async generateAnalytics(req: Request): Promise<UserAnalytics> {
    const userAgent = req.headers['user-agent'] as string || 'Unknown'
    const ip = this.getClientIP(req)
    const referrer = (req.headers.referer || req.headers.referrer) as string || 'Direct'
    
    const [location, deviceInfo] = await Promise.all([
      this.getLocationData(ip),
      Promise.resolve(this.parseUserAgent(userAgent))
    ])

    return {
      ip,
      userAgent,
      referrer,
      location,
      device: {
        type: deviceInfo.type,
        browser: deviceInfo.browser,
        platform: deviceInfo.platform
      },
      timestamp: new Date()
    }
  }

  /**
   * Check if IP is private/local
   */
  private static isPrivateIP(ip: string): boolean {
    return ip === '127.0.0.1' || 
           ip === 'localhost' || 
           ip.startsWith('192.168.') || 
           ip.startsWith('10.') || 
           ip.startsWith('172.')
  }
}