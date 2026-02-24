import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'pos_restaurant',
    user: process.env.DB_USER || 'pos_admin',
    password: process.env.DB_PASSWORD || 'pos_secure_2024',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  defaultBranchId: process.env.DEFAULT_BRANCH_ID || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
};
