import { defineArrayMember, defineField, defineType } from "sanity";
import { iconOptions } from "@/lib/iconOptions";

export const questionsType = defineType({
  name: "questions",
  type: "object",
  title: "Questions Section",
  preview: {
    prepare() {
      return {
        title: "Questions Component",
      };
    },
  },
  fields: [
    defineField({
      name: "questions",
      type: "array",
      title: "Questions",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              type: "string",
              title: "Question",
            }),
            defineField({
              name: "chatbotQuestion",
              type: "text",
              title: "Chatbot Question",
              description:
                "The actual question that will be sent to the chatbot (can be more detailed)",
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Short Description",
              description: "Brief description that appears under the question",
            }),
            defineField({
              name: "buttonText",
              type: "string",
              title: "Check Button Text",
              description:
                "Text to display on the check button for this question",
              initialValue: "Check Now",
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Question Icon",
              options: {
                list: iconOptions,
              },
              initialValue: "help-circle",
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
});
