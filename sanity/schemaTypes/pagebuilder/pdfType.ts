import { defineField, defineType } from "sanity";

export const pdfType = defineType({
  name: "pdfViewer",
  type: "object",
  title: "PDF Viewer",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "PDF Title",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "pdfFile",
      type: "file",
      title: "PDF File",
      options: {
        accept: ".pdf",
      },
    }),
  ],
});
