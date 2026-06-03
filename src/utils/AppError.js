class AppError extends Error {
    constructor(statusCode, errorCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
    }
}

module.exports = AppError;  