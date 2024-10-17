export default class AppError extends Error {
  public status: string;
  constructor(
    public message: string,
    public statusCode?: number,
    public validatorErrors?: object
  ) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}
