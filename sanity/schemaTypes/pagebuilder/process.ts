export const processType = {
  name: "process",
  title: "Process Section",
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
      name: "steps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Step Title",
              type: "string",
            },
            {
              name: "description",
              title: "Step Description",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
};
