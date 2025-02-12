import { defineField, defineType } from "sanity";

export const responsibilities = defineType({
  name: "responsibilities",
  type: "object",
  title: "Responsibilities Section",
  preview: {
    prepare() {
      return {
        title: "Responsibilities Component",
      };
    },
  },
  fields: [
    defineField({
      name: "sideImage",
      type: "image",
      title: "Side Image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "string",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "cta",
      type: "array",
      title: "Call to Action Buttons",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", type: "string", title: "Button Text" },
            { name: "link", type: "string", title: "Button Link" },
          ],
        },
      ],
    }),
  ],
});
