#!/usr/bin/env node

/**
 * Migration Script: Add Google Maps Environment Variables
 * 
 * This script helps set up Google Maps integration by:
 * 1. Checking if .env file exists
 * 2. Adding Google Maps configuration if missing
 * 3. Providing instructions for obtaining API key
 * 
 * Run: node migration_scripts/026-add-google-maps-env.js
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE_PATH = path.join(__dirname, '../dental-frontend/.env');
const ENV_EXAMPLE_PATH = path.join(__dirname, '../dental-frontend/.env.example');

const GOOGLE_MAPS_CONFIG = `
# ============================================
# Google Maps Configuration
# ============================================
# Get your API key from: https://console.cloud.google.com/google/maps-apis
# Required APIs: Maps JavaScript API, Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Default map center (Saigon International Dental Clinic)
NEXT_PUBLIC_DEFAULT_MAP_LAT=10.7769
NEXT_PUBLIC_DEFAULT_MAP_LNG=106.7009

# Map styling (optional)
# NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-custom-map-id
`;

function checkAndAddGoogleMapsConfig() {
  console.log("=".repeat(70));
  console.log("MIGRATION: Add Google Maps Environment Variables");
  console.log("=".repeat(70));
  console.log("");

  // Check if .env file exists
  const envExists = fs.existsSync(ENV_FILE_PATH);
  
  if (!envExists) {
    console.log("[INFO] No .env file found in dental-frontend/");
    console.log("[INFO] Creating .env file from .env.example...");
    
    // Try to copy from .env.example
    if (fs.existsSync(ENV_EXAMPLE_PATH)) {
      const exampleContent = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf8');
      fs.writeFileSync(ENV_FILE_PATH, exampleContent);
      console.log("[OK] Created .env file from .env.example");
    } else {
      // Create a minimal .env file
      fs.writeFileSync(ENV_FILE_PATH, GOOGLE_MAPS_CONFIG.trim() + '\n');
      console.log("[OK] Created new .env file with Google Maps config");
    }
  } else {
    // Read existing .env file
    const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    
    // Check if Google Maps config already exists
    if (envContent.includes('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')) {
      console.log("[OK] Google Maps configuration already exists in .env");
      console.log("");
      
      // Extract current value
      const match = envContent.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.+)/);
      if (match) {
        const currentValue = match[1].trim();
        if (currentValue === 'your-google-maps-api-key-here' || currentValue === '') {
          console.log("[WARN] Google Maps API key is not set!");
          console.log("       Please update NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env");
        } else {
          console.log("[OK] Google Maps API key is configured");
        }
      }
    } else {
      // Add Google Maps config to existing .env
      console.log("[INFO] Adding Google Maps configuration to .env...");
      fs.appendFileSync(ENV_FILE_PATH, '\n' + GOOGLE_MAPS_CONFIG);
      console.log("[OK] Added Google Maps configuration to .env");
    }
  }

  // Print instructions
  console.log("");
  console.log("-".repeat(70));
  console.log("SETUP INSTRUCTIONS");
  console.log("-".repeat(70));
  console.log("");
  console.log("To enable Google Maps integration, follow these steps:");
  console.log("");
  console.log("1. Go to Google Cloud Console:");
  console.log("   https://console.cloud.google.com/google/maps-apis");
  console.log("");
  console.log("2. Create a new project or select an existing one");
  console.log("");
  console.log("3. Enable the following APIs:");
  console.log("   - Maps JavaScript API");
  console.log("   - Places API (optional, for location search)");
  console.log("");
  console.log("4. Create an API key:");
  console.log("   - Go to 'Credentials' in the left sidebar");
  console.log("   - Click 'Create Credentials' > 'API Key'");
  console.log("   - Restrict the key to your domain for security");
  console.log("");
  console.log("5. Update your .env file:");
  console.log("   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key");
  console.log("");
  console.log("6. Restart the development server");
  console.log("");
  console.log("-".repeat(70));
  console.log("");

  // Verify environment variables
  console.log("ENVIRONMENT CHECK:");
  console.log("");
  
  const requiredVars = [
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_DEFAULT_MAP_LAT',
    'NEXT_PUBLIC_DEFAULT_MAP_LNG'
  ];

  const envContent = fs.existsSync(ENV_FILE_PATH) 
    ? fs.readFileSync(ENV_FILE_PATH, 'utf8') 
    : '';

  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    const match = envContent.match(new RegExp(`${varName}=(.+)`));
    const value = match ? match[1].trim() : 'not set';
    const isPlaceholder = value === 'your-google-maps-api-key-here' || value === '';
    
    if (!hasVar) {
      console.log(`  [--] ${varName}: not found`);
    } else if (isPlaceholder) {
      console.log(`  [!!] ${varName}: needs configuration`);
    } else {
      console.log(`  [OK] ${varName}: configured`);
    }
  });

  console.log("");
  console.log("=".repeat(70));
  console.log("MIGRATION COMPLETE");
  console.log("=".repeat(70));
}

// Run migration
checkAndAddGoogleMapsConfig();
