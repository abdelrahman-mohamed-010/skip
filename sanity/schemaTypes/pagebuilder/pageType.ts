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
        defineArrayMember({
          name: "blockcomponent",
          type: "blockcomponent",
        }),
        defineArrayMember({ name: "header", type: "header" }),
        defineArrayMember({ name: "finale", type: "finale" }),
        defineArrayMember({ name: "questions", type: "questions" }),
        defineArrayMember({ name: "slider", type: "slider" }),
      ],
    }),
    defineField({
      name: "showShareButton",
      type: "boolean",
      title: "Show Share Button",
      description: "Toggle to display share button on page.",
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
              name: "showShareButton",
              type: "boolean",
              title: "Show Share Button",
              description: "Toggle to display share button on inner page.",
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
                defineArrayMember({
                  name: "blockcomponent",
                  type: "blockcomponent",
                }),
                defineArrayMember({ name: "header", type: "header" }), // Added header component
                defineArrayMember({ name: "finale", type: "finale" }), // Added finale component
                defineArrayMember({ name: "questions", type: "questions" }), // Added questions component
                defineArrayMember({ name: "slider", type: "slider" }), // Add FAQ to inner pages
              ],
            }),
            defineField({
              name: "deepNestedPages",
              type: "array",
              title: "Deep Nested Pages",
              description: "Create third-level nested pages",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "deepNestedPage",
                  title: "Deep Nested Page",
                  fields: [
                    defineField({
                      name: "title",
                      type: "string",
                      title: "Deep Nested Page Title",
                    }),
                    defineField({
                      name: "slug",
                      type: "slug",
                      title: "Deep Nested Page Slug",
                      options: {
                        source: "title",
                        maxLength: 96,
                      },
                    }),
                    defineField({
                      name: "showShareButton",
                      type: "boolean",
                      title: "Show Share Button",
                      description:
                        "Toggle to display share button on deep nested page.",
                    }),
                    defineField({
                      name: "content",
                      type: "array",
                      title: "Page Content",
                      of: [
                        defineArrayMember({ name: "gallery", type: "gallery" }),
                        defineArrayMember({
                          name: "richText",
                          type: "richText",
                        }),
                        defineArrayMember({
                          name: "contentSlider",
                          type: "contentSlider",
                        }),
                        defineArrayMember({
                          name: "pdfViewer",
                          type: "pdfViewer",
                        }),
                        defineArrayMember({
                          name: "blockcomponent",
                          type: "blockcomponent",
                        }),
                        defineArrayMember({ name: "header", type: "header" }),
                        defineArrayMember({ name: "finale", type: "finale" }),
                        defineArrayMember({
                          name: "questions",
                          type: "questions",
                        }),
                        defineArrayMember({ name: "slider", type: "slider" }),
                      ],
                    }),
                    defineField({
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
                    }),
                  ],
                }),
              ],
            }),
            defineField({
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
            }),
          ],
        }),
      ],
    }),
    defineField({
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
    }),
  ],
});
