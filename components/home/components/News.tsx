import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

interface NewsItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  imageUrl: string;
  category: string;
}

async function getLatestNews(): Promise<NewsItem[]> {
  return await client.fetch(`
    *[_type == "news"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      "imageUrl": image.asset->url,
      "category": category->title
    }
  `);
}

const News = async () => {
  const latestNews = await getLatestNews();

  return (
    <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
          Latest Immigration News
        </h2>
        <p className="text-secondary text-base md:text-lg max-w-2xl">
          Stay informed with the most recent updates and changes in immigration
          law and policies
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {latestNews.map((news) => (
          <Link
            href={`/latest-immigration-news/${news.slug.current}`}
            key={news._id}
            className="group"
          >
            <article className="h-full flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
              {news.imageUrl && (
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                  {news.title}
                </h3>
                <p className="text-secondary text-sm mb-4 line-clamp-2 flex-grow">
                  {news.excerpt}
                </p>
                <div className="inline-flex items-center text-accent text-sm font-medium">
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Link
          href="/latest-immigration-news"
          className="inline-flex items-center text-sm px-6 py-3 bg-primary hover:bg-accent text-white rounded-md font-medium transition-colors duration-200"
        >
          View All Immigration News
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default News;
