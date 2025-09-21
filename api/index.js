const app = require('../server');
const serverless = require('serverless-http');

const handler = serverless(app);

module.exports = (req, res) => {
  // Reconstruct the original API path from Vercel's query parameter
  if (req.query && req.query.path) {
    req.url = '/api/' + req.query.path;
  }
  
  return handler(req, res);
};