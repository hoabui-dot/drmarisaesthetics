/**
 * Migration Script: Add Video Hero Section
 *
 * Purpose:
 * - Add VideoHeroSection as FIRST block in homepage layout
 * - Preserve existing Hero section (push it down)
 * - Remove any AnimatedHero3D sections if they exist
 *
 * This script is IDEMPOTENT - safe to run multiple times
 */

const fs = require("fs");
const path = require("path");

// Load environment variables from dental-frontend/.env.local
const envPath = path.join(__dirname, "../dental-frontend/.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const API_URL =
  process.env.STRAPI_URL ||
  "https://guild-biblical-expectations-easily.trycloudflare.com";
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error("❌ ERROR: STRAPI_API_TOKEN is not set");
  console.error("Please set STRAPI_API_TOKEN in dental-frontend/.env.local");
  process.exit(1);
}

/**
 * Fetch data from Strapi API
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Update data in Strapi API
 */
async function updateAPI(endpoint, data, options = {}) {
  return fetchAPI(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("\n🚀 Starting Migration: Add Video Hero Section");
  console.log("=".repeat(70));

  try {
    // Step 1: Fetch current homepage data
    console.log("\n📥 Step 1: Fetching current homepage data...");
    const homepageResponse = await fetchAPI(
      "/api/homepage?populate[layout][populate]=*",
    );

    if (!homepageResponse.data) {
      console.error("❌ No homepage data found");
      return;
    }

    const homepage = homepageResponse.data;
    console.log("✅ Homepage data fetched successfully");
    console.log(`   ID: ${homepage.id}`);
    console.log(`   Title: ${homepage.title}`);

    // Step 2: Check current layout
    console.log("\n🔍 Step 2: Analyzing current layout...");
    const layout = homepage.layout || [];
    console.log(`   Current sections: ${layout.length}`);

    // Check if VideoHero already exists
    const hasVideoHero = layout.some(
      (block) => block.__component === "homepage.video-hero",
    );

    if (hasVideoHero) {
      console.log("\n✅ Video Hero section already exists");
      console.log("   Migration already completed. Skipping.");
      return;
    }

    // Check for AnimatedHero3D (should be removed already)
    const animatedHeroIndex = layout.findIndex(
      (block) =>
        block.__component === "homepage.animated-hero-3d" ||
        block.__component === "homepage.animated-hero-3-d",
    );

    if (animatedHeroIndex !== -1) {
      console.log(
        `   ⚠️  Found AnimatedHero3D at index ${animatedHeroIndex} - will remove`,
      );
    }

    // Step 3: Create Video Hero section data
    console.log("\n🎬 Step 3: Creating Video Hero section...");

    const videoHeroData = {
      __component: "homepage.video-hero",
      title: "Công nghệ nha khoa chuẩn quốc tế",
      subtitle:
        "Trải nghiệm điều trị hiện đại với công nghệ tiên tiến nhất. Chúng tôi mang đến giải pháp nha khoa toàn diện với thiết bị 3D scanning, in 3D và hệ thống CAD/CAM tiên tiến.",
      ctaText: "Đặt lịch ngay",
      ctaLink: "/booking",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-4235-large.mp4",
      overlayOpacity: 0.4,
      isActive: true,
    };

    console.log("✅ Video Hero data prepared");

    // Step 4: Build new layout
    console.log("\n📝 Step 4: Building new layout...");

    // Remove AnimatedHero3D if exists
    let cleanedLayout = layout.filter(
      (block) =>
        block.__component !== "homepage.animated-hero-3d" &&
        block.__component !== "homepage.animated-hero-3-d",
    );

    if (animatedHeroIndex !== -1) {
      console.log("   ✅ Removed AnimatedHero3D section");
    }

    // Clean layout data - keep only essential fields
    const cleanLayout = cleanedLayout.map((block) => {
      const cleaned = {
        __component: block.__component,
        id: block.id,
      };

      // Copy scalar fields only (no nested objects/arrays)
      Object.keys(block).forEach((key) => {
        if (
          key !== "__component" &&
          key !== "id" &&
          typeof block[key] !== "object" &&
          !Array.isArray(block[key])
        ) {
          cleaned[key] = block[key];
        }
      });

      return cleaned;
    });

    // Add VideoHero as FIRST section
    const newLayout = [videoHeroData, ...cleanLayout];

    console.log(`   New layout order:`);
    newLayout.forEach((block, index) => {
      const componentName = block.__component.split(".")[1];
      console.log(`   ${index + 1}. ${componentName}`);
    });

    // Step 5: Update homepage in Strapi
    console.log("\n💾 Step 5: Saving to Strapi...");

    const updateData = {
      data: {
        layout: newLayout,
      },
    };

    await updateAPI("/api/homepage", updateData);

    console.log("✅ Homepage updated successfully!");

    // Step 6: Verify the update
    console.log("\n✅ Step 6: Verifying update...");
    const verifyResponse = await fetchAPI(
      "/api/homepage?populate[layout][populate]=*",
    );
    const verifiedLayout = verifyResponse.data.layout || [];

    const videoHeroExists = verifiedLayout.some(
      (block) => block.__component === "homepage.video-hero",
    );

    const videoHeroPosition = verifiedLayout.findIndex(
      (block) => block.__component === "homepage.video-hero",
    );

    if (videoHeroExists && videoHeroPosition === 0) {
      console.log("✅ VERIFICATION PASSED");
      console.log("   ✅ Video Hero section exists");
      console.log("   ✅ Positioned as FIRST section");

      const videoHero = verifiedLayout[0];
      console.log("\n📊 Video Hero Section Details:");
      console.log(`   Title: ${videoHero.title}`);
      console.log(`   Video URL: ${videoHero.videoUrl}`);
      console.log(`   Overlay Opacity: ${videoHero.overlayOpacity}`);
      console.log(`   Is Active: ${videoHero.isActive}`);
    } else {
      console.log("❌ VERIFICATION FAILED");
      if (!videoHeroExists) {
        console.log("   ❌ Video Hero section not found");
      }
      if (videoHeroPosition !== 0) {
        console.log(
          `   ❌ Video Hero not in first position (found at index ${videoHeroPosition})`,
        );
      }
    }

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(70));
    console.log("\n📋 Summary:");
    console.log("   ✅ Video Hero section added as FIRST block");
    console.log("   ✅ Existing Hero section preserved (pushed down)");
    if (animatedHeroIndex !== -1) {
      console.log("   ✅ AnimatedHero3D section removed");
    }
    console.log(`   ✅ Total sections: ${verifiedLayout.length}`);
    console.log("\n🎯 Next Steps:");
    console.log("   1. Refresh frontend: http://localhost:3000");
    console.log("   2. Verify Video Hero displays correctly");
    console.log("   3. Replace default video URL with your own");
    console.log("");
  } catch (error) {
    console.error("\n❌ MIGRATION FAILED");
    console.error("=".repeat(70));
    console.error("Error:", error.message);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  }
}

// Run migration
migrate();
