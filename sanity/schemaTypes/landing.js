/* eslint-disable import/no-anonymous-default-export */
export default {
  name: "landing",
  title: "Landing",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "pageBuilder",
      type: "array",
      title: "Page builder",
      of: [
        {
          name: "heroSection",
          title: "Hero Section",
          type: "object",
          preview: {
            prepare() {
              return {
                title: "Hero Component",
              };
            },
          },
          fields: [
            {
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            },
            {
              name: "learnMoreDatabase",
              title: "Learn More Database",
              type: "string",
            },
            {
              name: "learnMoreOnline",
              title: "Learn More Online",
              type: "string",
            },
          ],
        },
        {
          name: "mainSection",
          title: "Main Section",
          type: "object",
          preview: {
            prepare() {
              return {
                title: "Main Content Component",
              };
            },
          },
          fields: [
            {
              name: "mainHeading",
              title: "Main Heading",
              type: "string",
            },
            {
              name: "mainContent",
              title: "Main Content",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
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
            },
            {
              name: "videoUrl",
              title: "Video URL",
              type: "url",
              description: "YouTube video URL",
            },
            {
              name: "trialText",
              title: "Trial Text",
              type: "string",
            },
          ],
        },
        {
          name: "factsSection",
          title: "Facts Section",
          type: "object",
          preview: {
            prepare() {
              return {
                title: "Facts Component",
              };
            },
          },
          fields: [
            {
              name: "title",
              title: "Facts Title",
              type: "string",
            },
            {
              name: "factsList",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
        {
          name: "solutionsSection",
          title: "Solutions Section",
          type: "object",
          preview: {
            prepare() {
              return {
                title: "Solutions Component",
              };
            },
          },
          fields: [
            {
              name: "title",
              title: "Solutions Title",
              type: "string",
            },
            {
              name: "compare",
              title: "Compare Text",
              type: "string",
            },
            {
              name: "compareImage",
              type: "image",
              title: "Compare Image",
            },
            {
              name: "consultancy",
              title: "Consultancy Text",
              type: "string",
            },
            {
              name: "consultancyImage",
              type: "image",
              title: "Consultancy Image",
            },
            {
              name: "dataExport",
              title: "Data Export Text",
              type: "string",
            },
            {
              name: "dataExportImage",
              type: "image",
              title: "Data Export Image",
            },
          ],
        },
        {
          name: "testimonialsSection",
          title: "Testimonials Section",
          type: "object",
          preview: {
            prepare() {
              return {
                title: "Testimonials Component",
              };
            },
          },
          fields: [
            {
              name: "title",
              title: "Testimonials Title",
              type: "string",
            },
            {
              name: "quotes",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "quoteText",
                      title: "Quote Text",
                      type: "string",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
