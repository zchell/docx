// Serverless entry point for Vercel/Netlify
import app from './index'
import serverless from 'serverless-http'

// Export serverless handler
export default serverless(app)

// Also export for different serverless platforms
module.exports = serverless(app)
module.exports.handler = serverless(app)