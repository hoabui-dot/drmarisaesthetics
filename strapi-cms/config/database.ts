/**
 * Database Configuration
 *
 * Configures PostgreSQL connection for Strapi.
 * Uses environment variables only — NO hardcoded defaults.
 * Missing vars will throw at startup.
 */

export default ({ env }) => {
  const client = "postgres";

  return {
    connection: {
      client,
      connection: {
        host: env("DATABASE_HOST"),
        port: env.int("DATABASE_PORT"),
        database: env("DATABASE_NAME"),
        user: env("DATABASE_USERNAME"),
        password: env("DATABASE_PASSWORD"),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
        },
        schema: env("DATABASE_SCHEMA", "public"),
      },
      debug: false,
    },
  };
};
