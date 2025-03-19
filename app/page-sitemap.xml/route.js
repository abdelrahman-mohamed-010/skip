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
  // Update edge cases with corrected "about"
  const edgeCases = ["terms", "privacy", "about"];

  // Home page with priority 1.0 and daily changefreq
  dynamicUrls.push({ url: "/", changefreq: "daily", priority: 1.0 });

  // Main pages and nested pages
  pages.forEach((page) => {
    if (page.slug) {
      const mainChangefreq = edgeCases.includes(page.slug)
        ? "monthly"
        : "weekly";
      const mainPriority = edgeCases.includes(page.slug) ? 0.6 : 0.9;
      dynamicUrls.push({
        url: `/${page.slug}`,
        changefreq: mainChangefreq,
        priority: mainPriority,
      });
      if (page.innerPages) {
        page.innerPages.forEach((nested) => {
          if (nested.slug) {
            dynamicUrls.push({
              url: `/${page.slug}/${nested.slug}`,
              changefreq: "weekly",
              priority: 0.7,
            });
          }
        });
      }
    }
  });

  const sitemap = new SitemapStream({ hostname: "https://skiplegal.ai" });

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
