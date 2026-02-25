import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "6543", 10),
    name: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  defaultBranchId: process.env.DEFAULT_BRANCH_ID,
};
