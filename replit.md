# Microsoft Word Free Download - Replit Project

## Overview
This is a professional Microsoft Word download website with comprehensive analytics and tracking. The project has been successfully imported and configured for the Replit environment.

## Recent Changes
- **September 21, 2025**: Project imported from GitHub and fully configured for Replit
  - Installed all Node.js dependencies for both root and client packages
  - Configured React frontend (Vite dev server) on port 5000 with proper host settings
  - Configured Express backend server on port 3001 with localhost binding
  - Fixed port configuration conflicts and API proxy settings
  - Set up proper workflow configuration for both frontend and backend
  - Tested all API endpoints and frontend functionality
  - Set up VM deployment configuration for production
  - Verified download functionality for MSI file
  - Both development servers running successfully

## Project Architecture

### Backend (Express.js Server)
- **File**: `server.js`
- **Port**: 3001 (development), 5000 (production)
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

### Frontend (React + Vite)
- **Type**: React application with TypeScript
- **Dev Server**: Vite on port 5000
- **Directory**: `client/`
- **Features**:
  - Modern React components
  - TypeScript support
  - API proxy to backend
  - Hot module replacement
  - Production build optimization

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

## Workflows Configuration
### Development
- **Frontend Server**: `cd client && npm run dev` (port 5000)
- **Backend API**: `PORT=3001 npm start` (port 3001)

### Production
- **Deployment Target**: Autoscale (stateless website)
- **Run Command**: `npm start` (serves on port 5000)

## Environment Variables
- `NODE_ENV`: development/production
- `PORT`: 3001 (development), 5000 (production)
- `TELEGRAM_BOT_TOKEN`: (optional) For analytics
- `TELEGRAM_CHAT_ID`: (optional) For notifications

## User Preferences
*No specific user preferences configured yet*

## Development Notes
- React frontend (Vite dev server) on port 5000 proxies API calls to Express backend on port 3001
- Production uses Express server on port 5000 serving both static files and API endpoints
- MSI file (16.6MB) is included and properly served
- Telegram logging is configured but optional
- Multiple deployment platforms supported (Vercel, Netlify, Heroku, Railway, Render)

## Status
✅ **Fully Functional**: All features working correctly in Replit environment
- Frontend Server (React/Vite) running on 0.0.0.0:5000
- Backend API (Express) running on 0.0.0.0:3001
- API proxy working correctly
- Download functionality working
- Production deployment configured
- Analytics tracking operational