import { z, ZodSchema } from "zod";

export default class Validator {
  private errors: Record<string, string> = {};
  private schema: ZodSchema = z.any();
  private data: unknown;

  public static make(schema: ZodSchema, data: unknown): Validator {
    const validator = new Validator();
    validator.setSchema(schema, data);

    return validator;
  }

  private setSchema(schema: ZodSchema, data: unknown) {
    this.schema = schema;
    this.data = data;
  }

  public async validateAsync() {
    const result = await this.schema.safeParseAsync(this.data);

    if (result.success) return;

    for (let issue of result.error.issues) {
      for (let path of issue.path) {
        this.errors[String(path)] = issue.message;
      }
    }
  }

  public valid(): boolean {
    return Object.keys(this.errors || {}).length === 0;
  }

  public hasError(key: string): boolean {
    return Object.hasOwn(this.errors, key);
  }

  public getErrors(): Record<string, any> {
    return this.errors;
  }

  public error(key: string): string {
    return this.errors[key];
  }

  public static hydrateError(errors: unknown): Validator {
    const valdator = new Validator();

    valdator.errors = (errors as Record<string, any>) ?? {};

    return valdator;
  }
}
