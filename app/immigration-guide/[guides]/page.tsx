import { client } from "@/sanity/lib/client";
import RichTextRenderer from "@/components/RichTextRenderer";
import ShareButton from "@/components/ShareButton";

async function getGuide(slug: string) {
  return await client.fetch(
    `*[_type == "guides" && slug.current == $slug][0] {
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

const guidesPage = async ({ params }: { params: { guides: string } }) => {
  const guides = await getGuide(params.guides);

  if (!guides) {
    return <div>guides not found</div>;
  }

  return (
    <article className="container mx-auto px-4 mt-16 py-12 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl max-sm:text-2xl font-bold mb-4">
          {guides.title}
        </h1>
        <div className="flex items-center space-x-2">
          <time className="text-gray-600">
            {new Date(guides.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <ShareButton title={guides.title} />
        </div>
      </header>

      {guides.imageUrl && (
        <img
          src={guides.imageUrl}
          alt={guides.title}
          className="h-[250px] md:h-[400px] w-full object-cover rounded-lg mb-8"
        />
      )}

      <RichTextRenderer content={guides.content} />
    </article>
  );
};

export default guidesPage;
