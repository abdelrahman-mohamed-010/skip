export const featuresType = {
  name: "features",
  title: "Features Section",
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
      name: "featuresList",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Feature Title",
              type: "string",
            },
            {
              name: "description",
              title: "Feature Description",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
};
