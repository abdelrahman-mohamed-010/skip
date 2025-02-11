/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { User, Clock, Tag, ArrowRight } from "lucide-react";

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

const newsPage = async () => {
  const newss = await getNews();

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl max-sm:text-2xl font-bold text-primary text-center w-full">
            Immigration news
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newss.map((news: any, index: number) => (
            <Link
              href={`/latest-immigration-news/${news.slug.current}`}
              key={news._id}
              className="group"
            >
              <article
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-[200px] md:h-auto md:aspect-video object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {news.author || "SkipLegal"}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {news.estimatedReadingTime || "5 min read"}
                    </span>
                  </div>
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
};

export default newsPage;
