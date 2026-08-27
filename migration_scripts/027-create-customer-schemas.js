const fs = require('fs');
const path = require('path');

const STRAPI_DIR = path.join(__dirname, '../strapi-cms');

// Utility to create directory if it doesn't exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Application directories
const customerApiDir = path.join(STRAPI_DIR, 'src/api/customer');
const customerContentTypesDir = path.join(customerApiDir, 'content-types/customer');
const customerControllersDir = path.join(customerApiDir, 'controllers');
const customerRoutesDir = path.join(customerApiDir, 'routes');
const customerServicesDir = path.join(customerApiDir, 'services');
const customerComponentsDir = path.join(STRAPI_DIR, 'src/components/customer');

// Create directories
[
  customerContentTypesDir,
  customerControllersDir,
  customerRoutesDir,
  customerServicesDir,
  customerComponentsDir,
].forEach(ensureDir);

// 1. Single Type Schema
const customerSchema = {
  kind: "singleType",
  collectionName: "customers",
  info: {
    singularName: "customer",
    pluralName: "customers",
    displayName: "Customer",
    description: "Customer page content"
  },
  options: {
    draftAndPublish: true
  },
  pluginOptions: {},
  attributes: {
    title: {
      type: "string",
      required: true,
      default: "Our Customers - Saigon International Dental Clinic"
    },
    description: {
      type: "text",
      default: "Discover why thousands of patients trust Saigon International Dental Clinic for their dental care needs."
    },
    layout: {
      type: "dynamiczone",
      components: [
        "customer.hero",
        "customer.success-stories",
        "customer.benefits",
        "customer.statistics",
        "customer.faq",
        "customer.cta"
      ]
    }
  }
};
fs.writeFileSync(path.join(customerContentTypesDir, 'schema.json'), JSON.stringify(customerSchema, null, 2));

// 2. Controller, Route, Service for Customer Single Type
const controllerCode = `'use strict';\n\nconst { createCoreController } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreController('api::customer.customer');\n`;
fs.writeFileSync(path.join(customerControllersDir, 'customer.js'), controllerCode);

const routeCode = `'use strict';\n\nconst { createCoreRouter } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreRouter('api::customer.customer');\n`;
fs.writeFileSync(path.join(customerRoutesDir, 'customer.js'), routeCode);

const serviceCode = `'use strict';\n\nconst { createCoreService } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreService('api::customer.customer');\n`;
fs.writeFileSync(path.join(customerServicesDir, 'customer.js'), serviceCode);

// 3. Components
const components = {
  "hero.json": {
    collectionName: "components_customer_hero",
    info: { displayName: "Hero", description: "Customer page hero section" },
    options: {},
    attributes: {
      badge: { type: "string" },
      title: { type: "string" },
      subtitle: { type: "string" },
      description: { type: "text" },
      images: { type: "json" }
    }
  },
  "story-item.json": {
    collectionName: "components_customer_story_items",
    info: { displayName: "Story Item" },
    options: {},
    attributes: {
      name: { type: "string" },
      location: { type: "string" },
      treatment: { type: "string" },
      quote: { type: "text" },
      rating: { type: "integer", default: 5 },
      before_after: { type: "boolean", default: false },
      icon: { type: "string" }
    }
  },
  "success-stories.json": {
    collectionName: "components_customer_success_stories",
    info: { displayName: "Success Stories" },
    options: {},
    attributes: {
      badge: { type: "string" },
      title: { type: "string" },
      description: { type: "text" },
      stories: { type: "component", repeatable: true, component: "customer.story-item" }
    }
  },
  "benefit-item.json": {
    collectionName: "components_customer_benefit_items",
    info: { displayName: "Benefit Item" },
    options: {},
    attributes: {
      icon: { type: "string" },
      title: { type: "string" },
      description: { type: "text" }
    }
  },
  "benefits.json": {
    collectionName: "components_customer_benefits",
    info: { displayName: "Benefits" },
    options: {},
    attributes: {
      badge: { type: "string" },
      title: { type: "string" },
      description: { type: "text" },
      benefits: { type: "component", repeatable: true, component: "customer.benefit-item" }
    }
  },
  "stat-item.json": {
    collectionName: "components_customer_stat_items",
    info: { displayName: "Stat Item" },
    options: {},
    attributes: {
      number: { type: "string" },
      label: { type: "string" },
      suffix: { type: "string" },
      icon: { type: "string" }
    }
  },
  "statistics.json": {
    collectionName: "components_customer_statistics",
    info: { displayName: "Statistics" },
    options: {},
    attributes: {
      badge: { type: "string" },
      title: { type: "string" },
      stats: { type: "component", repeatable: true, component: "customer.stat-item" }
    }
  },
  "faq-item.json": {
    collectionName: "components_customer_faq_items",
    info: { displayName: "FAQ Item" },
    options: {},
    attributes: {
      question: { type: "text" },
      answer: { type: "text" }
    }
  },
  "faq.json": {
    collectionName: "components_customer_faq",
    info: { displayName: "FAQ" },
    options: {},
    attributes: {
      badge: { type: "string" },
      title: { type: "string" },
      description: { type: "text" },
      questions: { type: "component", repeatable: true, component: "customer.faq-item" }
    }
  },
  "contact-info-item.json": {
    collectionName: "components_customer_contact_info_items",
    info: { displayName: "Contact Info Item" },
    options: {},
    attributes: {
      text: { type: "string" }
    }
  },
  "cta.json": {
    collectionName: "components_customer_cta",
    info: { displayName: "CTA" },
    options: {},
    attributes: {
      badge: { type: "string" },
      title: { type: "string" },
      description: { type: "text" },
      primary_button_text: { type: "string" },
      primary_button_link: { type: "string" },
      secondary_button_text: { type: "string" },
      secondary_button_link: { type: "string" },
      contact_info: { type: "component", repeatable: true, component: "customer.contact-info-item" }
    }
  }
};

for (const [filename, schema] of Object.entries(components)) {
  fs.writeFileSync(
    path.join(customerComponentsDir, filename),
    JSON.stringify(schema, null, 2)
  );
  console.log(`Created component schema: ${filename}`);
}

console.log('Customer schemas created successfully.');
