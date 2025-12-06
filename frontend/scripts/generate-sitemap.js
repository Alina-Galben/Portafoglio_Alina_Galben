import { createClient } from 'contentful';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env' }); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const SITE_URL = process.env.VITE_SITE_URL || 'https://www.alinagalben.com';

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

const staticPages = [
  '',
  '/about',
  '/projects',
  '/blog',
  '/services',
  '/skills',
  '/certifications',
  '/statistics',
  '/contact'
];

async function generateSitemap() {
  console.log('🗺️  Generazione sitemap.xml in corso...');

  try {

    const entries = await client.getEntries({
      content_type: 'blogPost',
      select: 'fields.slug,sys.updatedAt'
    });

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticPages.forEach((page) => {
      sitemap += `
        <url>
            <loc>${SITE_URL}${page}</loc>
            <changefreq>weekly</changefreq>
            <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>`;
    });

    entries.items.forEach((entry) => {
      sitemap += `
        <url>
            <loc>${SITE_URL}/blog/${entry.fields.slug}</loc>
            <lastmod>${entry.sys.updatedAt.split('T')[0]}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
        </url>`;
    });

    sitemap += `
    </urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

    console.log('✅ sitemap.xml generata con successo in /public');
  } catch (error) {
    console.error('❌ Errore nella generazione della sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();