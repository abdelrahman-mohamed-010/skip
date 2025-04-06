import { defineField, defineType } from "sanity";

export const blockType = defineType({
  name: "blockcomponent",
  type: "object",
  title: "Block Section",
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Block Component",
      };
    },
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Block Title",
      description: "Optional title for the block section",
    }),
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
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
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
      validation: (Rule) => Rule.max(2),
      of: [
        {
          type: "object",
          fields: [
            {
              name: "text",
              type: "string",
              title: "Button Text",
            },
            {
              name: "buttonType",
              type: "string",
              title: "Button Type",
              options: {
                list: [
                  { title: "Normal Button", value: "normal" },
                  { title: "Call Button", value: "call" },
                  { title: "Chat Question", value: "chat" },
                ],
              },
              initialValue: "normal",
            },
            {
              name: "link",
              type: "string",
              title: "Button Link",
              hidden: ({ parent }) => parent?.buttonType === "chat",
            },
            {
              name: "chatbotQuestion",
              type: "text",
              title: "Chatbot Question",
              description: "The question to be sent to the chatbot",
              hidden: ({ parent }) => parent?.buttonType !== "chat",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "reverse",
      type: "boolean",
      title: "Reverse Layout",
      description:
        "If true, the image appears on the right instead of the left.",
    }),
  ],
});
