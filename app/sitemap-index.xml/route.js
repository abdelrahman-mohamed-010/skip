export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://skiplegal.ai/page-sitemap.xml</loc>
        <lastmod>2025-03-07T23:56:54.031Z</lastmod>
      </sitemap>
      <sitemap>
        <loc>https://skiplegal.ai/post-sitemap.xml</loc>
        <lastmod>2025-03-07T23:56:54.031Z</lastmod>
      </sitemap>
    </sitemapindex>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}
