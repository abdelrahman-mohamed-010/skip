"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Calendar, Tag, ArrowRight } from "lucide-react";
import CustomDropdown from "@/components/CustomDropdown";
import { client } from "@/sanity/lib/client";

async function getNews() {
  return await client.fetch(`
    *[_type == "news"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "imageUrl": image.asset->url,
      "author": author->name,
      "estimatedReadingTime": estimatedReadingTime,
      "category": category->title
    }
  `);
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    getNews().then(setNewsItems);
  }, []);

  const handleSort = (direction: "newest" | "oldest") => {
    const sorted = [...newsItems].sort((a, b) =>
      direction === "newest"
        ? new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        : new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
    setNewsItems(sorted);
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Better Title Style */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-primary">
            Latest Immigration News
          </h1>
          <div className="w-32 h-1 bg-accent mx-auto my-4 rounded-full"></div>
          <p className="text-lg text-secondary">
            Stay updated with the latest immigration news and updates.
          </p>
        </div>

        {/* Custom Dropdown for Sorting */}
        <div className="flex justify-end mb-6">
          <CustomDropdown onSort={handleSort} />
        </div>

        {/* News Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news, index) => (
            <Link
              href={`/latest-immigration-news/${news.slug.current}`}
              key={news._id}
              className="group"
            >
              <article
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                {/* ...existing image code... */}
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-[200px] object-cover"
                  />
                )}
                <div className="p-6">
                  {/* Card header with author and published date */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {news.author || "SkipLegal"}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(news.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {/* ...existing category, title, excerpt, and call-to-action... */}
                  {news.category && (
                    <div className="flex items-center mb-3">
                      <Tag className="w-4 h-4 mr-2 text-accent" />
                      <span className="text-sm text-accent">
                        {news.category}
                      </span>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-primary mb-3 line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-secondary mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <span className="inline-flex items-center text-primary group-hover:text-accent transition-colors duration-200">
                    Read Full Article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
