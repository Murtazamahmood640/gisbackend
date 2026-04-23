import app from "../app";
import { connectDB } from "../config/database";

let connected = false;

export default async function handler(req: any, res: any) {
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
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}