/* eslint-disable @typescript-eslint/no-unused-vars */
import { SitemapStream, streamToPromise } from "sitemap";
import { client } from "@/sanity/lib/client";

export async function GET(req) {
  // Fetch blogs, news, and guides in parallel.
  const [blogs, news, guides] = await Promise.all([
    client.fetch(`*[_type == "blog"]{ "slug": slug.current }`),
    client.fetch(`*[_type == "news"]{ "slug": slug.current }`),
    client.fetch(`*[_type == "guides"]{ "slug": slug.current }`),
  ]);

  const dynamicUrls = [];

  // Process blog posts.
  blogs.forEach((post) => {
    if (post.slug) {
      dynamicUrls.push({
        url: `/immigration-blog/${post.slug}`,
        changefreq: "daily",
        priority: 0.8,
      });
    }
  });

  // Process news posts.
  news.forEach((post) => {
    if (post.slug) {
      dynamicUrls.push({
        url: `/latest-immigration-news/${post.slug}`,
        changefreq: "daily",
        priority: 0.8,
      });
    }
  });

  // Process guides.
  guides.forEach((post) => {
    if (post.slug) {
      dynamicUrls.push({
        url: `/immigration-guide/${post.slug}`,
        changefreq: "daily",
        priority: 0.8,
      });
    }
  });

  const sitemap = new SitemapStream({ hostname: "http://localhost:3000" });

  dynamicUrls.forEach((urlData) => {
    sitemap.write(urlData);
  });

  sitemap.end();
  const xmlString = await streamToPromise(sitemap).then((sm) => sm.toString());

  return new Response(xmlString, {
    headers: { "Content-Type": "application/xml" },
  });
}

export default GET;
