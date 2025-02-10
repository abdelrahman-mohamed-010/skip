import { defineField, defineType } from "sanity";

export const contentSliderType = defineType({
  name: "contentSlider",
  type: "object",
  title: "Content Slider",
  fields: [
    defineField({
      name: "slides",
      type: "array",
      title: "Slides",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
            },
            {
              name: "image",
              type: "image",
              title: "Image",
            },
          ],
        },
      ],
    }),
  ],
});
