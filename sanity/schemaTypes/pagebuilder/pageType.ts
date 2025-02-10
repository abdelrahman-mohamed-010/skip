// import { defineArrayMember, defineField, defineType } from "sanity";

// export const pageType = defineType({
//   name: "page",
//   type: "document",
//   title: "Page",
//   fields: [
//     defineField({ name: "title", type: "string" }),
//     defineField({
//       name: "slug",
//       type: "slug",
//       description: "This is the page URL path (e.g., 'about', 'contact', 'services'). This will determine the page's web address.",
//       options: {
//         source: "title",
//         maxLength: 96,
//       },
//     }),
//     defineField({
//       name: "pageBuilder",
//       type: "array",
//       title: "Page builder",
//       of: [
//         defineArrayMember({
//           name: "gallery",
//           type: "gallery",
//         }),
//         defineArrayMember({
//           name: "richText",
//           type: "richText",
//         }),
//         defineArrayMember({
//           name: "contentSlider",
//           type: "contentSlider",
//         }),
//         defineArrayMember({
//           name: "pdfViewer",
//           type: "pdfViewer",
//         }),
//         // etc...
//       ],
//     }),
//   ],
// });

import { defineArrayMember, defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description:
        "This is the page URL path (e.g., 'about', 'contact', 'services'). This will determine the page's web address.",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "pageBuilder",
      type: "array",
      title: "Page Builder",
      of: [
        defineArrayMember({ name: "gallery", type: "gallery" }),
        defineArrayMember({ name: "richText", type: "richText" }),
        defineArrayMember({ name: "contentSlider", type: "contentSlider" }),
        defineArrayMember({ name: "pdfViewer", type: "pdfViewer" }),
      ],
    }),
    defineField({
      name: "innerPages",
      type: "array",
      title: "Inner Pages",
      description: "Create nested pages that act as a list of components",
      of: [
        defineArrayMember({
          type: "object",
          name: "innerPage",
          title: "Inner Page",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Inner Page Title",
            }),
            defineField({
              name: "slug",
              type: "slug",
              title: "Inner Page Slug",
              options: {
                source: "title",
                maxLength: 96,
              },
            }),
            defineField({
              name: "content",
              type: "array",
              title: "Page Content",
              of: [
                defineArrayMember({ name: "gallery", type: "gallery" }),
                defineArrayMember({ name: "richText", type: "richText" }),
                defineArrayMember({
                  name: "contentSlider",
                  type: "contentSlider",
                }),
                defineArrayMember({ name: "pdfViewer", type: "pdfViewer" }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
