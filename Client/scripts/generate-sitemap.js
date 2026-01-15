
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://careermapsolutions.com';

const staticRoutes = [
    '',
    '/about',
    '/services',
    '/contact',
    '/team',
    '/reviews',
    '/case-studies',
    '/privacy-policy',
    '/terms-of-service'
];

const serviceSlugs = [
    'bpo',
    'kpo',
    'legal',
    'recruitment',
    'it',
    'brand-promotion'
];

const serviceRoutes = serviceSlugs.map(slug => `/services/${slug}`);

const allRoutes = [...staticRoutes, ...serviceRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
        .map(route => {
            return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        })
        .join('')}
</urlset>`;

const publicDir = path.join(__dirname, '../public'); // Assuming scripts is in Client/scripts and public is Client/public

if (!fs.existsSync(publicDir)) {
    console.error(`Public directory not found at ${publicDir}`);
    process.exit(1);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('sitemap.xml generated successfully!');
