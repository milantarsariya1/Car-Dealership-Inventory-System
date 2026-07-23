import 'dotenv/config';

/**
 * Centralized environment configuration.
 * Fails fast at startup if required secrets are missing —
 * we never fall back to a hardcoded secret (it would be public in the repo).
 */
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
      'Copy .env.example to .env and provide a strong secret before starting the server.'
  );
}

export const env = {
  JWT_SECRET: jwtSecret,
  PORT: Number(process.env.PORT) || 5000,
};
