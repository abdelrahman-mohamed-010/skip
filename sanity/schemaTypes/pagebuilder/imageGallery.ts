import { defineField, defineType } from "sanity";

export const imageGalleryType = defineType({
  name: "gallery",
  type: "object",
  title: "Gallery",
  preview: {
    prepare() {
      return {
        title: 'Gallery Component'
      }
    }
  },
  fields: [
    {
      name: "galleryTitle",
      title: "Gallery Title",
      type: "string"
    },
    {
      name: "displayType",
      title: "Display Type",
      type: "string",
      options: {
        list: [
          { title: "Slider", value: "slider" },
          { title: "Grid", value: "grid" },
        ],
      },
      initialValue: "slider",
    },
    {
      name: "images",
      type: "array",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    },
  ],
});
