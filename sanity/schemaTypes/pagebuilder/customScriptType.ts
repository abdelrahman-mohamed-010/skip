import { defineField, defineType } from "sanity";

export const customScriptType = defineType({
  name: "customScript",
  type: "object",
  title: "Custom Scripts",
  fields: [
    defineField({
      name: "headScript",
      type: "text",
      title: "Head Script",
      description:
        "JavaScript or other code to be placed in the head section of the page (e.g. structured data)",
    }),
    defineField({
      name: "bodyScript",
      type: "text",
      title: "Body Script",
      description:
        "JavaScript or other code to be placed at the end of the body section",
    }),
  ],
});
