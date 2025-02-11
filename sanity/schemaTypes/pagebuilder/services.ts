export const servicesType = {
  name: "services",
  title: "Services Section",
  type: "object",
  fields: [
    {
      name: "sectionTitle",
      title: "Section Title",
      type: "string",
    },
    {
      name: "description",
      title: "Section Description",
      type: "text",
    },
    {
      name: "servicesList",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Service Title",
              type: "string",
            },
            {
              name: "description",
              title: "Service Description",
              type: "text",
            },
            {
              name: "link",
              title: "Service Link",
              type: "string",
            },
            {
              name: "progress",
              title: "Progress Percentage",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
};
