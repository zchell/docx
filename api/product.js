module.exports = async (req, res) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Return product information
    res.status(200).json({
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
};