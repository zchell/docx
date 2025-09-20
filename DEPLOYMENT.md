# Deployment Guide

This application can be deployed to multiple hosting platforms. Below are instructions for each supported platform.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. **Fork/Clone the repository**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
3. **Environment Variables**
   - Add your environment variables in Vercel dashboard
   - Optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (for logging)
   - `NODE_ENV` will be set to `production` automatically
4. **Deploy**
   - Vercel will automatically detect the serverless functions in `/api/`
   - Static files will be served from `/client/`
   - API routes will be available at `/api/*`
   - MSI file included in function bundle via `vercel.json`
   - Routes: `/api/product/info` and `/api/download/word-free`

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://www.netlify.com/deploy/)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `client`
   - Functions directory: `netlify/functions`
3. **Environment Variables**
   - Add in Netlify dashboard under Site settings > Environment variables
   - Optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (for logging)
4. **Deploy**
   - Netlify will serve static files from `/client/`
   - API functions available at `/.netlify/functions/server/api/*`
   - MSI file included in function bundle via `netlify.toml`
   - Routes: `/api/product/info` and `/api/download/word-free`

### Heroku
1. **Install Heroku CLI**
2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```
3. **Set Environment Variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set TELEGRAM_CHAT_ID=your_chat_id
   heroku config:set NODE_ENV=production
   ```
4. **Deploy**
   ```bash
   git push heroku main
   ```
   - The `Procfile` specifies `web: npm start`
   - `heroku-postbuild` script runs production build
   - Static files and APIs served from same dyno

### Railway
1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
2. **Environment Variables**
   - Add in Railway dashboard
3. **Deploy**
   - Railway will auto-deploy

### Render
1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Connect your repository
2. **Settings**
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. **Environment Variables**
   - Add in Render dashboard
4. **Deploy**

## 🔧 Environment Variables

### Required
- `PORT` - Server port (auto-set by most platforms)
- `NODE_ENV` - Set to `production` for production

### Optional (for Telegram logging)
- `TELEGRAM_BOT_TOKEN` - Your bot token from @BotFather
- `TELEGRAM_CHAT_ID` - Your chat ID for notifications

### Getting Telegram Credentials
1. **Create Bot**: Message @BotFather on Telegram, send `/newbot`
2. **Get Chat ID**: 
   - Send message to your bot
   - Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Find your chat ID in the response

## 🏗️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:prod

# Start production server
npm start
```

## 📁 Project Structure
```
/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel configuration
├── netlify.toml           # Netlify configuration
├── client/                # Static frontend files
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── public/
├── .env.example           # Environment template
└── README.md
```

## 🔍 Troubleshooting

### Build Failures
- Ensure Node.js version >= 18
- Check environment variables are set
- Verify all dependencies are installed

### Runtime Errors
- Check server logs in platform dashboard
- Verify environment variables
- Ensure MSI file exists in client/public/

### Telegram Not Working
- Verify bot token and chat ID
- Check bot permissions
- Test token with curl:
  ```bash
  curl https://api.telegram.org/bot<TOKEN>/getMe
  ```

## 📞 Support

- Check platform-specific documentation
- Review server logs
- Verify environment configuration