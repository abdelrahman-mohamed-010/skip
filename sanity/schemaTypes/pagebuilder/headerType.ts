import { defineArrayMember, defineField, defineType } from "sanity";

export const headerType = defineType({
  name: "header",
  type: "object",
  title: "Header",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "cards",
      type: "array",
      title: "Information Cards",
      of: [
        defineArrayMember({
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Card Title",
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Card Description",
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Icon Name",
              description:
                "Enter the Lucide icon name (e.g., 'Users2', 'Briefcase', 'Globe')",
            }),
            defineField({
              name: "isHighlighted",
              type: "boolean",
              title: "Highlight Card",
              description:
                "If enabled, card will have a different background color",
            }),
            defineField({
              name: "link",
              type: "string",
              title: "Card Link",
              description: "Enter the URL where this card should link to",
            }),
          ],
        }),
      ],
    }),
  ],
});
