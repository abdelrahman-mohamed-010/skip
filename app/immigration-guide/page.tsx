"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Calendar, Tag, ArrowRight } from "lucide-react";
import CustomDropdown from "@/components/CustomDropdown";
import { client } from "@/sanity/lib/client";

async function getGuide() {
  return await client.fetch(`
    *[_type == "guides"] | order(publishedAt desc) {
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

export default function GuidesPage() {
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    getGuide().then(setGuides);
  }, []);

  const handleSort = (direction: "newest" | "oldest") => {
    const sorted = [...guides].sort((a, b) =>
      direction === "newest"
        ? new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        : new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
    setGuides(sorted);
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Better Title Style */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-primary">
            Immigration Guides
          </h1>
          <div className="w-32 h-1 bg-accent mx-auto my-4 rounded-full"></div>
          <p className="text-lg text-secondary">
            Comprehensive guides to help you navigate immigration processes.
          </p>
        </div>

        {/* Custom Dropdown for Sorting */}
        <div className="flex justify-end mb-6">
          <CustomDropdown onSort={handleSort} />
        </div>

        {/* Guides Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Link
              href={`/immigration-guide/${guide.slug.current}`}
              key={guide._id}
              className="group"
            >
              <article
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                {/* ...existing image code... */}
                {guide.imageUrl && (
                  <img
                    src={guide.imageUrl}
                    alt={guide.title}
                    className="w-full h-[200px] object-cover"
                  />
                )}
                <div className="p-6">
                  {/* Card header with author and published date */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {guide.author || "SkipLegal"}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(guide.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {/* ...existing category, title, excerpt, and call-to-action... */}
                  {guide.category && (
                    <div className="flex items-center mb-3">
                      <Tag className="w-4 h-4 mr-2 text-accent" />
                      <span className="text-sm text-accent">
                        {guide.category}
                      </span>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-primary mb-3 line-clamp-2">
                    {guide.title}
                  </h2>
                  <p className="text-secondary mb-4 line-clamp-3">
                    {guide.excerpt}
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
