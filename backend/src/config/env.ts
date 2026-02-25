import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "10000", 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "6543", 10),
    name: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "pos-restaurant-secret-2026",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  defaultBranchId: process.env.DEFAULT_BRANCH_ID,
};

if (!env.db.host || !env.db.user || !env.db.password) {
  console.error("❌ ERROR: Faltan variables de base de datos en el entorno.");
}
