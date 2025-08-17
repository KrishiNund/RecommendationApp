/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.recoards.com',  // your domain
  generateRobotsTxt: true,              // generates robots.txt automatically
  trailingSlash: false,
  exclude: [
    '/dashboard',
    '/profile',
    '/api',
    '/api/*',
    '/board',
    '/board/*',
    '/public',
    '/public/*',
    '/upgrade',
    '/upgrade/*',
    '/login',
    '/signup',

  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: [
            '/dashboard',
            '/profile',
            '/api',
            '/api/*',
            '/board',
            '/board/*',
            '/public',
            '/public/*',
            '/upgrade',
            '/upgrade/*',
            '/login',
            '/signup'
            ] 
        },
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'monthly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
