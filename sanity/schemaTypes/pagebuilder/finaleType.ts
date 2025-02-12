import { defineField, defineType } from "sanity";

export const finaleType = defineType({
  name: "finale",
  type: "object",
  title: "Finale Section",
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
      name: "image",
      type: "image",
      title: "Background Image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "cta",
      type: "object",
      title: "Call to Action",
      fields: [
        defineField({
          name: "text",
          type: "string",
          title: "Button Text",
        }),
        defineField({
          name: "link",
          type: "string",
          title: "Button Link",
        }),
      ],
    }),
  ],
});
