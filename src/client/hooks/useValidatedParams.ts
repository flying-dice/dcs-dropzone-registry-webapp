import type { ZodSchema } from "zod";
import { useParams } from "react-router-dom";

export function useValidatedParams<T>(schema: ZodSchema<T>): T {
  const params = useParams();
  return schema.parse(params);
}
