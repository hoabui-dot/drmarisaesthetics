export default {
  routes: [
    {
      method: "GET",
      path: "/seo/sitemap",
      handler: "sitemap.find",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/seo/robots",
      handler: "sitemap.robots",
      config: { auth: false },
    },
  ],
};
