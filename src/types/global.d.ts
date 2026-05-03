// This file extends the global Node.js type definitions to add a custom "mongoose" property to the global object.
// This is commonly used in Next.js or serverless environments to prevent multiple connections to MongoDB
// by storing the connection and connection promise on the global object across hot reloads or repeated imports.

import mongoose from 'mongoose';

declare global {
  // The global "mongoose" variable holds:
  // - conn: the active mongoose connection (or null if not connected)
  // - promise: a promise that resolves to a mongoose connection (or null if not connecting)
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
} 