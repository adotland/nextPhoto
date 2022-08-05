/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    if (isFeaturedPage(path)) {
      return {
        loc: path,
        changefreq: 'always',
        priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      }
    }
    else if (isMapParkPage(path)) {
      return {}
    }
    else {
      // Use default transformation for all other cases
      return {
        loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        alternateRefs: config.alternateRefs ?? [],
      }
    }
  },
}

function isFeaturedPage(path) {
  return path.indexOf('/featured') !== -1
}

function isMapParkPage(path) {
  return path.match(/\/map\/[a-z0-9]+/)
}

module.exports = config
