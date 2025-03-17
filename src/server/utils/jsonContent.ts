import { resolver } from "hono-openapi/zod";
import { ZodSchema } from "zod";

/**
 * Creates a JSON content object for API responses.
 *
 * This function generates a content object with a specified JSON schema and description,
 * which can be used to define the structure and description of JSON responses in API documentation.
 */
export function jsonContent<T extends ZodSchema>(
  schema: T,
  description: string,
) {
  return {
    content: { "application/json": { schema: resolver(schema) } },
    description,
  };
}
