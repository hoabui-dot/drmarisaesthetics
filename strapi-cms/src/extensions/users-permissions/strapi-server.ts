type ContentTypeSchema = {
  pluginOptions?: Record<string, Record<string, unknown>>
}

type UsersPermissionsPlugin = {
  contentTypes?: {
    user?: {
      schema?: ContentTypeSchema
    }
  }
}

/**
 * Keep the Users & Permissions user model available to the plugin runtime,
 * while removing it from the Content Manager and Content-Type Builder.
 *
 * The plugin still needs `plugin::users-permissions.user` and `up_users` for
 * authentication, JWT validation and the `user.me` endpoint.
 */
export default (plugin: UsersPermissionsPlugin) => {
  const userSchema = plugin.contentTypes?.user?.schema
  if (!userSchema) return plugin

  userSchema.pluginOptions = {
    ...userSchema.pluginOptions,
    'content-manager': {
      ...userSchema.pluginOptions?.['content-manager'],
      visible: false,
    },
    'content-type-builder': {
      ...userSchema.pluginOptions?.['content-type-builder'],
      visible: false,
    },
  }

  return plugin
}
