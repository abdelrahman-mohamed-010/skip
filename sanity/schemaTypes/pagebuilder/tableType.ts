import { defineField, defineType } from "sanity";

export const tableType = defineType({
  name: "table",
  type: "object",
  title: "Table",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Table Title",
    }),
    defineField({
      name: "rows",
      type: "array",
      title: "Table Rows",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "cells",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
        },
      ],
    }),
  ],
});
