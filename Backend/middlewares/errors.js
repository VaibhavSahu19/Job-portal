class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
};

export const errorMiddleware = (error, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internale Server Error";
    if(error.name === "CastError"){
        const message = `Invalid ${error.path}`;
        error = new ErrorHandler(message, 400);
    }if(error.statusCode === 11000){
        const message = `Duplicate ${Object.keys(error.keyValue)} entered.`;
        error = new ErrorHandler(message, 400);
    }if(error.name === "JsonwebTokenError"){
        const message = `JSON Web Token invalid. Try Again`;
        error = new ErrorHandler(message, 400);
    }if(error.name === "TokenExpiredError"){
        const message = `Session Expried. Please Log in again.`;
        error = new ErrorHandler(message, 400);
    }
    return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error
    })
};

export default ErrorHandler;