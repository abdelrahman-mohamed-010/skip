import { type SchemaPluginOptions } from "sanity";
import { schemaTypes } from "./schemaTypes";

export const schema: SchemaPluginOptions = {
  types: schemaTypes,
};
