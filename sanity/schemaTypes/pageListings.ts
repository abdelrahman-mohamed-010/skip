export default {
  name: "pageListings",
  type: "document",
  title: "Page Listings",
  fields: [
    {
      name: "identifier",
      type: "string",
      title: "Identifier",
      options: {
        list: [
          { title: "Blogs Listing", value: "blogs" },
          { title: "Guides Listing", value: "guides" },
          { title: "News Listing", value: "news" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
        },
        {
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    },
  ],
};
