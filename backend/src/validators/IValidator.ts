export type ValidationResult = { ok: true } | { ok: false; code: string; message: string };

export interface IValidator<T> {
  validate(input: T): Promise<ValidationResult>;
}

export const ok = (): ValidationResult => ({ ok: true });
export const err = (code: string, message: string): ValidationResult => ({
  ok: false,
  code,
  message,
});

export async function runPipeline<T>(
  validators: IValidator<T>[],
  input: T,
): Promise<ValidationResult> {
  for (const v of validators) {
    const res = await v.validate(input);
    if (!res.ok) return res;
  }
  return ok();
}
