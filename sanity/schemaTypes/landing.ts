export default {
  name: "landing",
  title: "Landing Page",
  type: "document",
  fields: [
    {
      name: "pageTitle",
      title: "Page Title",
      type: "string",
    },
    {
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        { type: "hero" },
        { type: "features" },
        { type: "services" },
        { type: "process" },
      ],
    },
    {
      name: "footer",
      title: "Footer Section",
      type: "object",
      fields: [
        {
          name: "legalAssistanceTitle",
          title: "Legal Assistance Title",
          type: "string",
          initialValue: "Get Legal Assistance",
        },
        {
          name: "legalAssistanceDescription",
          title: "Legal Assistance Description",
          type: "text",
          initialValue:
            "Connect with our experienced immigration lawyers for personalized guidance on your journey",
        },
      ],
    },
  ],
};
