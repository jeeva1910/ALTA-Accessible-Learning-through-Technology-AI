import mongoose from "mongoose";
import { sanitizeMongoUri } from "../utils/security";

interface DatabaseStatus {
  isConnected: boolean;
  state: "disconnected" | "connecting" | "connected" | "disconnecting" | "error";
  host?: string;
  name?: string;
  error?: string;
  lastConnected?: Date;
}

let dbStatus: DatabaseStatus = {
  isConnected: false,
  state: "disconnected",
};

/**
 * Connect to MongoDB Atlas via Mongoose using MONGODB_URI
 */
export async function connectToDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === "") {
    console.warn(
      "[MongoDB] Notice: MONGODB_URI environment variable is not defined. Database features will run in offline/mock mode."
    );
    dbStatus = {
      isConnected: false,
      state: "disconnected",
      error: "MONGODB_URI is not configured in environment variables",
    };
    return false;
  }

  // If already connected
  if (mongoose.connection.readyState === 1) {
    dbStatus.isConnected = true;
    dbStatus.state = "connected";
    dbStatus.host = mongoose.connection.host;
    dbStatus.name = mongoose.connection.name;
    return true;
  }

  try {
    dbStatus.state = "connecting";
    console.log("[MongoDB] Connecting to MongoDB Atlas...");

    // Clean up URI (strip surrounding quotes or extra whitespace that might have been pasted)
    const cleanUri = uri.trim().replace(/^["']|["']$/g, '');

    // Configure connection options with resilient TLS/SSL handling and connection pool limits
    await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 20,
      minPoolSize: 2,
      autoIndex: false,
    });

    dbStatus = {
      isConnected: true,
      state: "connected",
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      lastConnected: new Date(),
    };

    console.log(`[MongoDB] Successfully connected to database: "${mongoose.connection.name}"`);
    return true;
  } catch (err: any) {
    // Sanitize any error message that might contain the connection string or credentials
    let rawError = err?.message || String(err);
    const sanitizedError = sanitizeMongoUri(rawError);
    console.error("[MongoDB] Connection notice:", sanitizedError);
    
    let userFriendlyError = "Database connection failed. Please check network connectivity and credentials.";
    if (rawError.includes("whitelist") || rawError.includes("Could not connect to any servers") || rawError.includes("tlsv1 alert")) {
      userFriendlyError = "MongoDB Atlas blocked the connection. Please allow IP Access in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0).";
    } else if (rawError.includes("Authentication failed") || rawError.includes("bad auth")) {
      userFriendlyError = "MongoDB authentication failed. Please verify database username and password in MONGODB_URI.";
    }

    dbStatus = {
      isConnected: false,
      state: "error",
      error: userFriendlyError,
    };

    // Schedule background retry after 20 seconds
    setTimeout(() => {
      if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
        console.log("[MongoDB] Retrying connection in background...");
        connectToDatabase().catch(() => {});
      }
    }, 20000);

    return false;
  }
}

// Set up connection event listeners
mongoose.connection.on("connected", () => {
  dbStatus.isConnected = true;
  dbStatus.state = "connected";
  dbStatus.host = mongoose.connection.host;
  dbStatus.name = mongoose.connection.name;
  dbStatus.lastConnected = new Date();
  console.log("[MongoDB] Connection established.");
});

mongoose.connection.on("error", (err) => {
  dbStatus.isConnected = false;
  dbStatus.state = "error";
  const sanitized = sanitizeMongoUri(err?.message || "Unknown database error");
  dbStatus.error = sanitized;
  console.error("[MongoDB] Runtime notice:", sanitized);
});

mongoose.connection.on("disconnected", () => {
  dbStatus.isConnected = false;
  dbStatus.state = "disconnected";
  console.log("[MongoDB] Disconnected from database.");
});

/**
 * Get current MongoDB connection status
 */
export function getDatabaseStatus(): DatabaseStatus {
  const readyState = mongoose.connection.readyState;
  const stateMap: Record<number, DatabaseStatus["state"]> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    ...dbStatus,
    isConnected: readyState === 1,
    state: stateMap[readyState] || dbStatus.state,
    host: mongoose.connection.host || dbStatus.host,
    name: mongoose.connection.name || dbStatus.name,
  };
}

/**
 * Check if MongoDB connection is ready for operations
 */
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default {
  connectToDatabase,
  getDatabaseStatus,
  isDatabaseConnected,
};
