/**
 * Migration: Update Hero Location Data with Real Coordinates
 *
 * Updates the hero component with accurate location data for
 * Saigon International Dental Clinic in Ho Chi Minh City
 */

const { Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST || "100.68.50.41",
  port: process.env.DATABASE_PORT || 5437,
  user: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "dental_cms_strapi",
});

async function up() {
  try {
    await client.connect();
    console.log("Connected to database");

    // Update hero component with accurate location data
    // Using District 1, Ho Chi Minh City coordinates (near Nguyen Hue Walking Street)
    console.log("Updating hero location data...");

    const result = await client.query(
      `
      UPDATE components_contact_heroes
      SET 
        location_name = $1,
        location_address = $2,
        location_lat = $3,
        location_lng = $4,
        show_map = $5
      WHERE id = 6
      RETURNING id, location_name, location_lat, location_lng;
    `,
      [
        "Saigon International Dental Clinic",
        "233 â 233A Nguyá»n Trá»ng Tuyá»n, PhÆ°á»ng PhÃº Nhuáº­n, TP. Há» ChÃ­ Minh, Viá»t Nam",
        10.7769, // Latitude for District 1, HCMC
        106.7009, // Longitude for District 1, HCMC
        true,
      ],
    );

    if (result.rows.length > 0) {
      console.log("Updated hero component:", result.rows[0]);
      console.log("✓ Location data updated successfully!");
    } else {
      console.warn("No hero component found with id = 6");
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

async function down() {
  try {
    await client.connect();
    console.log("Connected to database for rollback");

    // Reset location data to null
    console.log("Resetting hero location data...");

    await client.query(
      `
      UPDATE components_contact_heroes
      SET 
        location_name = NULL,
        location_address = NULL,
        location_lat = NULL,
        location_lng = NULL,
        show_map = true
      WHERE id = 6;
    `,
    );

    console.log("Rollback completed successfully!");
  } catch (error) {
    console.error("Rollback failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
if (require.main === module) {
  const command = process.argv[2];

  if (command === "down") {
    down()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    up()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { up, down };
