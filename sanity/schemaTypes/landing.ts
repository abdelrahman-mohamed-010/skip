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
    // New SEO input fields:
    {
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Custom title for SEO purposes.",
    },
    {
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      description: "Custom description for SEO purposes.",
    },
    {
      name: "seoKeywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Custom keywords for SEO.",
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
