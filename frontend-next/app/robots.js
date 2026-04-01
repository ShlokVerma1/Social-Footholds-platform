export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/orders', '/payment', '/admin', '/api'],
      },
    ],
    sitemap: 'https://socialfootholds.com/sitemap.xml',
  };
}
