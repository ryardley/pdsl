/* istanbul ignore file because testing when super fails is irrelavent */

type ErrorLike = {
  message: string;
  path: string;
};

export class ValidationError extends Error {
  name = "ValidationError";

  constructor(
    message?: string,
    public path: string = "",
    public inner: ErrorLike[] = []
  ) {
    super(message);
  }
}
