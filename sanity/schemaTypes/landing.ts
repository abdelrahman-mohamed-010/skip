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
    // Removed footer field here as the form title and description are now in separate schema.
  ],
};
