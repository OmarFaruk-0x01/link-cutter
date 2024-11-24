import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function validateAsync(
  schema: ZodSchema,
  data: unknown,
): Promise<Record<string, any> | null> {
  const result = await schema.safeParseAsync(data);
  if (result.success) return null;

  const errors: Record<string, any> = {};
  for (let issue of result.error.issues) {
    for (let path of issue.path) {
      errors[String(path)] = issue.message;
    }
  }

  return errors;
}

export const getShortDomainHost = () => {
  return process.env.SHORT_URL_HOST as string;
};
