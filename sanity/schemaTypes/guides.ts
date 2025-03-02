export default {
  name: "guides",
  type: "document",
  title: "guides",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
      },
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
    },
    {
      name: "image",
      type: "image",
      title: "Cover Image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "excerpt",
      type: "text",
      title: "Excerpt",
    },
    {
      name: "content",
      type: "array",
      title: "Content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "H5", value: "h5" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                title: "Link",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
        },
        {
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "description",
              type: "array",
              title: "Description",
              of: [{ type: "block" }],
            },
          ],
        },
        {
          type: "object",
          name: "cta",
          title: "CTA Button",
          fields: [
            { name: "text", type: "string", title: "Button Text" },
            { name: "link", type: "string", title: "Button URL" },
            {
              name: "alignment",
              type: "string",
              title: "Button Alignment",
              options: {
                list: ["left", "center", "right"],
              },
              initialValue: "left",
            },
          ],
        },
      ],
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
