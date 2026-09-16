#!/usr/bin/env node

/**
 * Safe Results repair.
 *
 * This migration deliberately does not replace the Results document or its
 * repeatable cases. It only restores the known Media Library relation for
 * existing cases whose image relation was lost by the old bootstrap seed.
 * Content Manager values remain the source of truth.
 */
const { Client } = require("pg");

const imageNamesByCase = {
  "042": "before-after-1.png",
  "089": "result-10.png",
  "112": "result-10 (1).png",
  "056": "5eb02f3f-4e84-47ca-be37-865177dd99ef.png",
};

async function main() {
  const client = new Client({
    host: process.env.DATABASE_HOST || process.env.POSTGRES_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || process.env.POSTGRES_PORT || 5432),
    database: process.env.DATABASE_NAME || process.env.POSTGRES_DB,
    user: process.env.DATABASE_USERNAME || process.env.POSTGRES_USER,
    password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  try {
    await client.query("BEGIN");

    const cases = await client.query(
      `SELECT id, case_number FROM components_result_cases
       WHERE case_number = ANY($1::text[]) ORDER BY id`,
      [Object.keys(imageNamesByCase)],
    );
    const files = await client.query(
      `SELECT id, name FROM files WHERE name = ANY($1::text[])`,
      [Object.values(imageNamesByCase)],
    );
    const fileByName = new Map(files.rows.map((file) => [file.name, file.id]));
    let inserted = 0;
    let skipped = 0;

    for (const item of cases.rows) {
      const fileId = fileByName.get(imageNamesByCase[item.case_number]);
      if (!fileId) {
        console.warn(`[results] Missing Media Library file for case ${item.case_number}`);
        continue;
      }

      const relation = await client.query(
        `SELECT 1 FROM files_related_mph
         WHERE file_id = $1 AND related_id = $2
           AND related_type = 'result.case' AND field = 'image'
         LIMIT 1`,
        [fileId, item.id],
      );
      if (relation.rowCount) {
        skipped += 1;
        continue;
      }

      await client.query(
        `INSERT INTO files_related_mph
          (file_id, related_id, related_type, field, "order")
         VALUES ($1, $2, 'result.case', 'image', NULL)`,
        [fileId, item.id],
      );
      inserted += 1;
    }

    await client.query("COMMIT");
    console.log(`[results] Existing cases checked: ${cases.rowCount}; image relations restored: ${inserted}; already present: ${skipped}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`[results] repair failed: ${error.message}`);
  process.exitCode = 1;
});
