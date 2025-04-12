import { client } from "@/sanity/lib/client";
import ShareButton from "@/components/ShareButton";
import BlogRichText from "@/components/BlogsRichText";
import PageScripts from "@/components/PageScripts";

async function getBlog(slug: string) {
  return await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0] {
      title,
      publishedAt,
      "imageUrl": image.asset->url,
      content[] {
        ...,
        _type == "image" => {
          ...,
          asset->
        }
      },
      customScripts
    }`,
    { slug }
  );
}

const BlogPage = async ({ params }: { params: { blog: string } }) => {
  const blog = await getBlog(params.blog);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <>
      <PageScripts
        headScript={blog.customScripts?.headScript}
        bodyScript={blog.customScripts?.bodyScript}
      />
      <article className="container mx-auto px-4 mt-16 py-12 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl max-sm:text-2xl  text-primary font-bold mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-2 w-full justify-between border-b-2 pb-3">
            <time className="text-gray-600">
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <ShareButton title={blog.title} />
          </div>
        </header>

        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="h-[250px] md:h-[400px] w-full object-cover rounded-lg mb-8"
          />
        )}
        <BlogRichText content={blog.content} />
      </article>
    </>
  );
};

export default BlogPage;
