import { client } from "@/sanity/lib/client";
import ShareButton from "@/components/ShareButton";
import BlogRichText from "@/components/BlogsRichText";

async function getNews(slug: string) {
  console.log('Fetching news for slug:', slug);
  const data = await client.fetch(
    `*[_type == "news" && slug.current == $slug][0] {
      title,
      publishedAt,
      "imageUrl": image.asset->url,
      headScript,
      bodyScript,
      content[] {
        ...,
        _type == "image" => {
          ...,
          asset->
        }
      },
    }`,
    { slug }
  );
  console.log('Fetched bodyScript:', data?.bodyScript);
  return data;
}

export default async function NewsPage({
  params,
}: {
  params: { news: string };
}) {
  // Await params directly as recommended in the error message
  params = await params;
  const news = await getNews(params.news);

  if (!news) {
    return <div>news not found</div>;
  }

  const bodyScriptHtml = news?.bodyScript || '';

  return (
    <>
      {/* Add the body script directly to the page */}
      {bodyScriptHtml && (
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: bodyScriptHtml }}
        />
      )}
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
    </>
  );
}
