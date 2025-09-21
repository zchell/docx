const app = require('../server');
const serverless = require('serverless-http');

const handler = serverless(app);

module.exports = (req, res) => {
  // Reconstruct the original API path from Vercel's query parameter with security validation
  if (req.query && req.query.path) {
    // Whitelist of allowed API paths to prevent path traversal attacks
    const allowedPaths = [
      'download/word-free',
      'product/info'
    ];
    
    const requestedPath = req.query.path;
    
    // Check if the requested path is in our whitelist
    if (allowedPaths.includes(requestedPath)) {
      req.url = '/api/' + requestedPath;
    } else {
      // Reject any path not in whitelist - return 404
      res.status(404).json({ error: 'API endpoint not found' });
      return;
    }
  }
  
  return handler(req, res);
};