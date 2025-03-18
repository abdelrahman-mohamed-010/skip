import { Rule } from "@sanity/types";

const footer = {
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    {
      name: "footerTitle",
      validation: (Rule: Rule) => Rule.required(),
      type: "string",
    },
    {
      name: "companyInfo",
      title: "Company Information",
      type: "object",
      fields: [
        {
          name: "description",
          title: "Description",
          type: "text",
        },
        {
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "platform",
                  title: "Platform",
                  type: "string",
                  options: {
                    list: ["facebook", "twitter", "instagram", "linkedin"],
                  },
                },
                {
                  name: "url",
                  title: "URL",
                  type: "url",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "column1",
      title: "Column 1 Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "text",
              title: "Link Text",
              type: "string",
            },
            {
              name: "url",
              title: "URL",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "column2",
      title: "Column 2 Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "text",
              title: "Link Text",
              type: "string",
            },
            {
              name: "url",
              title: "URL",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "column3",
      title: "Column 3 Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "text",
              title: "Link Text",
              type: "string",
            },
            {
              name: "url",
              title: "URL",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        { name: "email", title: "Email", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "address", title: "Address", type: "string" },
      ],
    },
    {
      name: "bottomLinks",
      title: "Bottom Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Link Text", type: "string" },
            { name: "url", title: "URL", type: "string" },
          ],
        },
      ],
    },
  ],
};

export default footer;
