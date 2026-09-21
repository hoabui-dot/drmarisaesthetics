import { Search } from '@strapi/icons'
import { PLUGIN_ID } from './pluginId'

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: Search,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'SEO Manager',
      },
      Component: () => import('./pages/App'),
      permissions: [{ action: 'plugin::seo-manager.health', subject: null }],
    })
    app.registerPlugin({ id: PLUGIN_ID, name: PLUGIN_ID })
  },
}
