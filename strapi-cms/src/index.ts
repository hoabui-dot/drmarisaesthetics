export default {
  /**
   * Register only framework/plugin compatibility routes.
   * CMS content is never created or seeded here.
   */
  register({ strapi }) {
    // webtools-addon-sitemap@1.3.1 probes this compatibility endpoint.
    strapi.server.router.get("/webtools/sitemap/init", (ctx) => {
      ctx.body = { ok: true };
    });
  },

  /**
   * Infrastructure-only bootstrap.
   *
   * Restart, rebuild, deploy and application boot must never mutate,
   * publish, replace or delete editor-owned Strapi content. Initial content
   * belongs in an explicit, reviewed migration or the Content Manager.
   */
  async bootstrap({ strapi }) {
    console.log("--- Bootstrap: infrastructure-only mode ---");
    try {
      const hasSitemapTable = await strapi.db.connection.schema.hasTable("wt_sitemap");
      if (!hasSitemapTable) {
        await strapi.db.connection.schema.createTable("wt_sitemap", (table) => {
          table.increments("id").primary();
          table.string("document_id", 255);
          table.text("sitemap_string").notNullable();
          table.string("name", 255).notNullable().defaultTo("default");
          table.string("type", 255).notNullable().defaultTo("default_hreflang");
          table.integer("delta").notNullable().defaultTo(1);
          table.integer("link_count");
          table.timestamp("created_at");
          table.timestamp("updated_at");
          table.timestamp("published_at");
          table.integer("created_by_id");
          table.integer("updated_by_id");
          table.string("locale", 255);
          table.index(["document_id", "locale", "published_at"], "wt_sitemap_documents_idx");
        });
        console.log("[BOOTSTRAP] Created missing Webtools sitemap persistence table.");
      }

      // Permissions are infrastructure configuration. They are only created
      // when absent and never change any content value or publication state.
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
        const publicReadActions = [
          "api::redirect.redirect.find",
          "api::navigation.navigation.find",
          "api::homepage.homepage.find",
          "api::our-team.our-team.find",
          "api::result.result.find",
          "api::footer.footer.find",
          "api::seo-manager-settings.seo-manager-settings.find",
          "api::canonical-rule.canonical-rule.find",
          "api::blog.blog.find",
          "api::service.service.find",
          "api::website-setting.website-setting.find",
          "api::treatments-page.treatments-page.find",
          "api::contact-page.contact-page.find",
        ];

        for (const action of publicReadActions) {
          const permission = await strapi
            .query("plugin::users-permissions.permission")
            .findOne({ where: { role: publicRole.id, action } });

          if (!permission) {
            await strapi.query("plugin::users-permissions.permission").create({
              data: { role: publicRole.id, action },
            });
            console.log(`[BOOTSTRAP] Added missing public read permission: ${action}`);
          }
        }
      }

      console.log("[BOOTSTRAP] No CMS content seed executed; existing data preserved.");
    } catch (error: any) {
      console.error("[BOOTSTRAP] Infrastructure setup error:", error.message);
      if (error.details) {
        console.error("[BOOTSTRAP] Details:", JSON.stringify(error.details, null, 2));
      }
    }
    console.log("--- Bootstrap end ---");
  },
};
