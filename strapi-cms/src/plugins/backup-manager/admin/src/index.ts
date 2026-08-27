import { Download } from '@strapi/icons';
import { PLUGIN_ID } from './pluginId';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: Download,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Backup Management',
      },
      Component: async () => {
        const { App } = await import('./pages/App');
        return App;
      },
      permissions: [{ action: 'plugin::backup-manager.download', subject: null }],
    });
    app.registerPlugin({ id: PLUGIN_ID, name: PLUGIN_ID });
  },
};
