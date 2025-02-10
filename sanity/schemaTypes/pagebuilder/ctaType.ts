import { defineField, defineType } from "sanity";


export const ctaType = defineType({
  name: "cta",
  type: "object",
  title: "Call to Action",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "buttonText",
      type: "string",
      title: "Button Text",
    }),
    defineField({
      name: "buttonLink",
      type: "string",
      title: "Button Link",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Background Image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
