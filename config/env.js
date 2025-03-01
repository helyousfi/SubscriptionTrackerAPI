import { config } from 'dotenv';

// Determine the correct environment file
const envFile = `.env.${process.env.NODE_ENV || 'development'}.local`;

config({ path: envFile });

export const { PORT, 
    DB_URI, 
    NODE_ENV, 
    JWT_SECRET, 
    JWT_EXPIRE_IN, 
    ARCJET_KEY, 
    ARCJET_ENV,
    SERVER_URL,
    QSTASH_URL,
    QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    EMAIL_PASSWORD
    } = process.env;
