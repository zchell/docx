# Microsoft Word Product Page - Static Website

## Overview
This is a static HTML website that appears to be a scraped/exported version of Microsoft's Word product page from their online store. It contains all the necessary assets including HTML, CSS, JavaScript, fonts, and images to render the complete page locally.

## Project Structure
```
/
├── index.html          # Main product page
├── css/               # Stylesheets and CSS assets
├── js/                # JavaScript files and libraries
├── fonts/             # Font files (TTF, WOFF, WOFF2)
├── images/            # Images and favicon
└── replit.md          # This documentation file
```

## Current State
- **Status**: Successfully running and deployed
- **Server**: Python HTTP server serving static files
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows external access through Replit proxy)

## Technical Setup
- **Frontend**: Static HTML website with CSS/JS assets
- **Web Server**: Python's built-in HTTP server (`python -m http.server`)
- **Deployment**: Configured for autoscale deployment target
- **Expected 404s**: Some JavaScript files reference Microsoft's server paths that don't exist locally (normal for scraped sites)

## Recent Changes
- **September 17, 2025**: Initial project setup and import completion
  - Installed Python 3.11 for HTTP server
  - Configured workflow to serve on port 5000
  - Set up deployment configuration for autoscale
  - Verified website loads and displays correctly

## User Preferences
- This project uses static file serving, no specific coding style preferences identified
- Uses standard Python HTTP server for simplicity and reliability

## Project Architecture
- **Type**: Static website
- **Language**: HTML/CSS/JavaScript (client-side only)
- **Server**: Python HTTP server
- **Dependencies**: Python 3.11 (for HTTP server only)
- **Build Process**: None required (static files)

## Notes
- Website displays Microsoft Word product page with pricing and features
- Some console errors are expected due to missing server-side components
- All essential assets (CSS, JS, images, fonts) are included and working
- Site is fully functional for viewing and demonstrating the product page layout