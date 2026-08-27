/**
 * Database Configuration
 *
 * Configures PostgreSQL connection for Strapi.
 * Uses environment variables for flexibility across environments.
 */

module.exports = ({ env }) => {
  const client = "postgres";

  return {
    connection: {
      client,
      connection: {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "dental_cms_strapi"),
        user: env("DATABASE_USERNAME", "postgres"),
        password: env("DATABASE_PASSWORD", "postgres"),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
        },
        schema: env("DATABASE_SCHEMA", "public"),
      },
      debug: false,
    },
  };
};
