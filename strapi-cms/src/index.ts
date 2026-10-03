import { randomUUID } from 'node:crypto'

function parseAdminPermissionProperties(value: unknown): unknown {
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) } catch { return value }
}

function getPermissionFields(value: unknown): string[] {
  const parsed = parseAdminPermissionProperties(value)
  if (Array.isArray(parsed)) return parsed.filter((field): field is string => typeof field === 'string')
  if (!parsed || typeof parsed !== 'object') return []
  const properties = parsed as Record<string, unknown>
  if (Array.isArray(properties.fields)) return properties.fields.filter((field): field is string => typeof field === 'string')
  return []
}

function normalisePermissionProperties(value: unknown): Record<string, unknown> {
  const parsed = parseAdminPermissionProperties(value)
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed as Record<string, unknown>
    : {}
}

async function ensureContentManagerFieldPermissions(strapi: any) {
  const requirements: Record<string, string[]> = {
    'api::website-setting.website-setting': [
      'blog_categories', 'blog_categories.category_id', 'blog_categories.label', 'blog_categories.icon',
      'service_categories', 'service_categories.category_id', 'service_categories.label', 'service_categories.icon',
    ],
    'api::blog.blog': ['blog_category_id'],
    'api::service.service': ['service_category_id'],
  }
  const permissionQuery = strapi.db.connection('admin_permissions')
  const actions = [
    'plugin::content-manager.explorer.create',
    'plugin::content-manager.explorer.read',
    'plugin::content-manager.explorer.update',
  ]

  for (const [subject, requiredFields] of Object.entries(requirements)) {
    const permissions = await permissionQuery
      .where({ subject })
      .whereIn('action', actions)
      .select(['id', 'action', 'properties'])
    const completeFields = [...new Set([
      ...requiredFields,
      ...permissions.flatMap((permission: any) => getPermissionFields(permission.properties)),
    ])]

    for (const permission of permissions) {
      const properties = normalisePermissionProperties(permission.properties)
      const nextProperties = { ...properties, fields: completeFields }
      if (JSON.stringify(properties) === JSON.stringify(nextProperties)) continue
      await permissionQuery.where({ id: permission.id }).update({ properties: nextProperties })
      strapi.log.info(`[Bootstrap] Repaired Content Manager field permissions for ${subject} (${permission.action}).`)
    }
  }
}

async function ensureServiceEditLayout(strapi: any) {
  const uid = 'api::service.service'
  const contentType = strapi.contentTypes?.[uid]
  const contentTypeService = strapi.plugin('content-manager')?.service('content-types')
  if (!contentType || !contentTypeService) return

  try {
    const configuration = await contentTypeService.findConfiguration(contentType)
    const rows = configuration?.layouts?.edit
    if (!Array.isArray(rows)) return

    const categoryRowIndex = rows.findIndex((row: any[]) =>
      Array.isArray(row) && row.some((field: any) => field?.name === 'service_category_id'),
    )
    const blocksRowIndex = rows.findIndex((row: any[]) =>
      Array.isArray(row) && row.some((field: any) => field?.name === 'contentBetterBlocks'),
    )
    if (categoryRowIndex === -1 || blocksRowIndex === -1 || categoryRowIndex < blocksRowIndex) return

    const categoryField = rows[categoryRowIndex].find((field: any) => field?.name === 'service_category_id')
    if (!categoryField) return

    const nextRows = rows
      .map((row: any[]) => row.filter((field: any) => field !== categoryField))
      .filter((row: any[]) => row.length > 0)
    const nextBlocksRowIndex = nextRows.findIndex((row: any[]) =>
      row.some((field: any) => field?.name === 'contentBetterBlocks'),
    )
    if (nextBlocksRowIndex === -1) return

    nextRows.splice(nextBlocksRowIndex, 0, [categoryField])
    await contentTypeService.updateConfiguration(contentType, {
      ...configuration,
      layouts: { ...configuration.layouts, edit: nextRows },
    })
    strapi.log.info('[Bootstrap] Service Category moved before Content Better Blocks in Service editor.')
  } catch (error: any) {
    strapi.log.warn(`[Bootstrap] Could not update Service editor layout: ${error?.message || 'unknown error'}`)
  }
}

const WEBSITE_SETTING_UID = 'api::website-setting.website-setting'
const CATEGORY_FIELDS = ['blog_categories', 'service_categories'] as const

type WebsiteCategory = { id?: string | number; category_id?: string | null; [key: string]: unknown }
type WebsiteCategoriesData = Partial<Record<(typeof CATEGORY_FIELDS)[number], WebsiteCategory[]>>

function ensureWebsiteCategoryIds(data: WebsiteCategoriesData | undefined, existing?: WebsiteCategoriesData) {
  if (!data) return

  for (const field of CATEGORY_FIELDS) {
    const categories = data[field]
    if (!Array.isArray(categories)) continue

    const existingIds = new Map(
      (Array.isArray(existing?.[field]) ? existing[field] : [])
        .filter((category) => category?.id != null && category.category_id)
        .map((category) => [String(category.id), category.category_id as string]),
    )
    const usedIds = new Set<string>()

    data[field] = categories.map((category) => {
      const submittedId = typeof category.category_id === 'string' ? category.category_id.trim() : ''
      const priorId = category.id != null ? existingIds.get(String(category.id)) : undefined
      const id = submittedId || priorId || randomUUID()
      // IDs are internal stable keys. If a malformed payload repeats an ID,
      // repair only the duplicate item instead of linking two labels together.
      const uniqueId = usedIds.has(id) ? randomUUID() : id
      usedIds.add(uniqueId)
      return { ...category, category_id: uniqueId }
    })
  }
}

async function getWebsiteCategories(strapi: any, documentId: string, status: string | undefined) {
  if (!documentId) return undefined
  return strapi.documents(WEBSITE_SETTING_UID).findOne({
    documentId,
    status: status === 'published' ? 'published' : 'draft',
    populate: { blog_categories: true, service_categories: true },
  })
}

function registerWebsiteCategoryMiddleware(strapi: any) {
  strapi.documents.use(async (context: any, next: () => Promise<unknown>) => {
    if (context.uid !== WEBSITE_SETTING_UID || !['create', 'update'].includes(context.action)) {
      return next()
    }

    const params = context.params || {}
    const data = params.data as WebsiteCategoriesData | undefined
    const existing = context.action === 'update'
      ? await getWebsiteCategories(strapi, params.documentId, params.status)
      : undefined
    const oldCategoryIds = Object.fromEntries(CATEGORY_FIELDS.map((field) => [
      field,
      (Array.isArray(existing?.[field]) ? existing[field] : [])
        .map((category) => category.category_id)
        .filter((id): id is string => typeof id === 'string' && Boolean(id)),
    ])) as Record<(typeof CATEGORY_FIELDS)[number], string[]>

    ensureWebsiteCategoryIds(data, existing || undefined)
    const result = await next()

    if (existing && data) {
      for (const [field, assignmentField, uid] of [
        ['blog_categories', 'blog_category_id', 'api::blog.blog'],
        ['service_categories', 'service_category_id', 'api::service.service'],
      ] as const) {
        if (!Array.isArray(data[field])) continue
        const retained = new Set(data[field].map((category) => category.category_id).filter(Boolean))
        const removed = oldCategoryIds[field].filter((id) => !retained.has(id))
        if (removed.length) {
          await strapi.db.query(uid).updateMany({
            where: { [assignmentField]: { $in: removed } },
            data: { [assignmentField]: null },
          })
        }
      }
    }

    return result
  })
}

export default {
  /**
   * Register only framework/plugin compatibility routes.
   * CMS content is never created or seeded here.
   */
  register({ strapi }) {
    registerWebsiteCategoryMiddleware(strapi)

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
    strapi.customFields.register({
      name: "homepage-result-case-order",
      type: "json",
    });
    strapi.customFields.register({
      name: "website-category-id",
      type: "string",
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
      await ensureContentManagerFieldPermissions(strapi)
      await ensureServiceEditLayout(strapi)

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
