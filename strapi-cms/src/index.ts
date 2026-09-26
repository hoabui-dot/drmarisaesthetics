export default {
  /**
   * Register only framework/plugin compatibility routes.
   * CMS content is never created or seeded here.
   */
  register({ strapi }) {
    strapi.customFields.register({
      name: "service-navigation-order",
      type: "integer",
      inputSize: { default: 6, isResizable: true },
    });
    strapi.customFields.register({
      name: "result-category-id",
      type: "string",
    });
    strapi.customFields.register({
      name: "result-category-select",
      type: "string",
    });
    strapi.customFields.register({
      name: "result-category-multi-select",
      type: "json",
    });

    // These SEO records are intentionally hidden from the Content Manager
    // navigation because they are edited through the SEO Manager plugin.
    // Strapi's default Content Manager permission registry only exposes
    // visible content types, which otherwise causes authenticated SEO
    // Manager requests to fail with 403 (including for Super Admin).
    // Extend the official Admin role permission reset hook so the hidden
    // types remain manageable through standard Content Manager endpoints and
    // can also be granted explicitly to other Admin roles.
    const roleService = strapi.service("admin::role");
    const seoContentTypes = [
      "api::seo-manager-settings.seo-manager-settings",
      "api::robots-settings.robots-settings",
      "api::redirect.redirect",
      "api::canonical-rule.canonical-rule",
    ];
    const permissionHook = roleService?.hooks?.willResetSuperAdminPermissions;

    if (permissionHook && !permissionHook.__seoManagerHiddenTypesRegistered) {
      permissionHook.register(async (permissions) => {
        const permissionService = strapi.service("admin::permission");
        const contentTypeService = strapi.service("admin::content-type");
        const contentTypeActions = permissionService.actionProvider
          .values()
          .filter((action) => action.section === "contentTypes");

        for (const action of contentTypeActions) {
          action.subjects = Array.from(
            new Set([...action.subjects, ...seoContentTypes]),
          );
        }

        const hiddenTypeActions = contentTypeActions.flatMap((action) =>
          seoContentTypes.map((subject) => ({ ...action, subjects: [subject] })),
        );
        const hiddenTypePermissions = contentTypeService.getPermissionsWithNestedFields(
          hiddenTypeActions,
        );

        return [...permissions, ...hiddenTypePermissions];
      });
      permissionHook.__seoManagerHiddenTypesRegistered = true;
    }
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
      // Permissions are infrastructure configuration. They are only created
      // when absent and never change any content value or publication state.
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
        const publicReadActions = [
          "api::redirect.redirect.find",
          "api::homepage.homepage.find",
          "api::about-page.about-page.find",
          "api::our-team.our-team.find",
          "api::deep-plane-facelift-specialist.deep-plane-facelift-specialist.find",
          "api::result.result.find",
          "api::seo-manager-settings.seo-manager-settings.find",
          "api::robots-settings.robots-settings.find",
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
