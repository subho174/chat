class ApiResponse {
  constructor(statusCode, data, message = "default message") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    //this.success = statusCode < 301 && statusCode >= 200;
  }
}

module.exports = { ApiResponse };
