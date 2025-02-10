import { defineField, defineType } from "sanity";

const menuItemFields = [
  {
    name: "itemType",
    type: "string",
    title: "Item Type",
    options: {
      list: [
        { title: "Link", value: "link" },
        { title: "Title with Submenu", value: "title" },
      ],
    },
  },
  {
    name: "text",
    title: "Text",
    type: "string",
  },
  {
    name: "link",
    type: "string",
    title: "Link URL",
    // Removed the hidden property to allow links for all item types
  },
  {
    name: "subItems",
    type: "array",
    title: "Sub Menu Items",
    hidden: ({ parent }: { parent: { itemType: string } }) =>
      parent?.itemType === "link",
    of: [
      {
        type: "object",
        fields: [
          {
            name: "text",
            title: "Sub Link Text",
            type: "string",
          },
          {
            name: "link",
            type: "string",
            title: "Link URL",
          },
        ],
      },
    ],
  },
];

export const navigationType = defineType({
  name: "navigation",
  type: "document",
  title: "Navigation",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Navigation Title",
    }),
    defineField({
      name: "items",
      type: "array",
      title: "Navigation Items",
      of: [
        {
          type: "object",
          name: "menuItem",
          fields: menuItemFields,
          preview: {
            select: {
              itemType: "itemType",
              text: "text",
              link: "link",
              subItems: "subItems",
            },
            prepare({ itemType, text, link, subItems }) {
              return {
                title: text || "No text",
                subtitle:
                  itemType === "link"
                    ? `🔗 ${link || "No URL"}`
                    : `📁 ${(subItems || []).length} sub-items`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
