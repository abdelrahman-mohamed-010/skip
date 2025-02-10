/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { User, Clock, Tag, ArrowRight } from "lucide-react";

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

const guidesPage = async () => {
  const guidess = await getGuide();

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl max-sm:text-2xl font-bold text-primary">
            Immigration guides
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidess.map((guides: any, index: number) => (
            <article
              key={guides._id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md "
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              {guides.imageUrl && (
                <img
                  src={guides.imageUrl}
                  alt={guides.title}
                  className="w-full h-[200px] md:h-auto md:aspect-video object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {guides.author || "SkipLegal"}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {guides.estimatedReadingTime || "5 min read"}
                  </span>
                </div>
                {guides.category && (
                  <div className="flex items-center mb-3">
                    <Tag className="w-4 h-4 mr-2 text-accent" />
                    <span className="text-sm text-accent">
                      {guides.category}
                    </span>
                  </div>
                )}
                <h2 className="text-lg font-semibold text-primary mb-3 line-clamp-2">
                  {guides.title}
                </h2>
                <p className="text-secondary mb-4 line-clamp-3">
                  {guides.excerpt}
                </p>
                <Link
                  href={`/immigration-guide/${guides.slug.current}`}
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200"
                >
                  Read Full Article
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default guidesPage;
