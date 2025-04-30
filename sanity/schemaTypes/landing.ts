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
      name: "headScript",
      type: "text",
      title: "Head Script",
      description:
        "JavaScript or other code to be placed in the head section of the page (e.g. structured data)",
    },
    {
      name: "bodyScript",
      type: "text",
      title: "Body Script",
      description:
        "JavaScript or other code to be placed at the end of the body section",
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
