/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/sitemap.js or app/api/sitemap/route.js
import { SitemapStream, streamToPromise } from "sitemap";
import { client } from "@/sanity/lib/client";

export async function GET(req) {
  // Fetch pages from Sanity CMS
  const pages = await client.fetch(`*[_type == "page"]{
    "slug": slug.current,
    innerPages[]{
      "slug": slug.current
    }
  }`);

  const dynamicUrls = [];
  // Edge case slugs array
  const edgeCases = ["terms", "privacy", "about-us"];

  // Home page with priority 1.0
  dynamicUrls.push({ url: "/", changefreq: "daily", priority: 1.0 });

  // Main pages with priority 0.9 (or 0.6 if an edge case) and nested pages with priority 0.7
  pages.forEach((page) => {
    if (page.slug) {
      const mainPriority = edgeCases.includes(page.slug) ? 0.6 : 0.9;
      dynamicUrls.push({
        url: `/${page.slug}`,
        changefreq: "daily",
        priority: mainPriority,
      });
      if (page.innerPages) {
        page.innerPages.forEach((nested) => {
          if (nested.slug) {
            dynamicUrls.push({
              url: `/${page.slug}/${nested.slug}`,
              changefreq: "daily",
              priority: 0.7,
            });
          }
        });
      }
    }
  });

  const sitemap = new SitemapStream({ hostname: "http://localhost:3000" });

  dynamicUrls.forEach((urlData) => {
    sitemap.write(urlData);
  });

  sitemap.end();

  const xmlString = await streamToPromise(sitemap).then((sm) => sm.toString());

  return new Response(xmlString, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export default GET;
