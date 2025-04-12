class ApiError extends Error {
  constructor(statusCode, message = "Error", errors = []) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors =errors
  }
}

module.exports = {ApiError}
