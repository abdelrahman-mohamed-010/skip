import { client } from "@/sanity/lib/client";
import ShareButton from "@/components/ShareButton";
import BlogRichText from "@/components/BlogsRichText";

async function getNews(slug: string) {
  return await client.fetch(
    `*[_type == "news" && slug.current == $slug][0] {
      title,
      publishedAt,
      "imageUrl": image.asset->url,
      content[] {
        ...,
        _type == "image" => {
          ...,
          asset->
        }
      }
    }`,
    { slug }
  );
}

const newsPage = async ({ params }: { params: { news: string } }) => {
  const news = await getNews(params.news);

  if (!news) {
    return <div>news not found</div>;
  }

  return (
    <article className="container mx-auto px-4 mt-16 py-12 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl text-primary max-sm:text-2xl font-bold mb-4">
          {news.title}
        </h1>
        <div className="flex items-center space-x-2 w-full justify-between border-b-2 pb-3">
          <time className="text-gray-600">
            {new Date(news.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <ShareButton title={news.title} />
        </div>
      </header>

      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="h-[250px] md:h-[400px] w-full object-cover rounded-lg mb-8"
        />
      )}
      <BlogRichText content={news.content} />
    </article>
  );
};

export default newsPage;
