class AppError extends Error {
    constructor(statusCode, errorCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.message = message;
    }
}

module.exports = AppError;  