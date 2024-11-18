// Trying out: https://x.com/mattpocockuk/status/1633064377518628866

export type Result<T> = { ok: true; value: T } | { ok: false; error: unknown };

export function attempt<Args extends any[], Return>(
  func: (...args: Args) => Return
) {
  return (...args: Args): Result<Return> => {
    try {
      return { ok: true, value: func(...args) };
    } catch (error) {
      return { ok: false, error };
    }
  };
}
