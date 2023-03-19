class CustomStatusCodeError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CustomStatusCodeError";
    this.statusCode = statusCode;
  }
}

export default CustomStatusCodeError;
