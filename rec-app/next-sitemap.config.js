/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.recoards.com',  // your domain
  generateRobotsTxt: true,              // generates robots.txt automatically
  trailingSlash: false,
  exclude: [
    '/dashboard/*',  
    '/api/*',
    '/board/*',
    '/profile/*',
    '/public/*',
    '/upgrade/*'

  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/dashboard', '/api', '/board', '/profile', '/public', '/upgrade'] },
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
