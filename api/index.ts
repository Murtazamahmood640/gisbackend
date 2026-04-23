import app from "../app.js";
import { connectDB } from "../config/database.js";

let connected = false;

export default async function handler(req: any, res: any) {
  // Set CORS headers for all responses
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!connected) {
      await connectDB();
      connected = true;
    }
    // Directly use the express app as the handler
    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error during initialization",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
        hint: "Check your MONGODB_URI and Cloudinary environment variables."
      });
    }
  }
}