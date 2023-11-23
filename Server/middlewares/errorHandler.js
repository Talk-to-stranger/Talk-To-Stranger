function errorHandler(error, req, res, next) {
    let status, message;
    switch (error.name) {
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400;
            message = error.errors.map(el => {
                return el.message;
            });
            break;
        case "NullEmail":
            status = 400;
            message = ["Email is missing"];
            break;
        case "NullPassword":
            status = 400;
            message = ["Password is missing"];
            break;
        case "NullFile":
            status = 400;
            message = ["File is missing"];
            break;
        case "ErrorEmailorPassword":
            status = 401;
            message = ["Invalid email/password"];
            break;
        case "JsonWebTokenError":
            status = 401;
            message = ["Invalid JWT Token"];
            break;
        case "Unauthenticated":
            status = 401;
            message = ["Unauthenticated"];
            break;
        case "Forbidden":
            status = 403;
            message = ["You are not authorized"];
            break;
        case "NotFound":
            status = 404;
            message = ["Data not found"] ;
            break;
        default:
            status = 500;
            message = ["Internal server error"];
            break;
    }
    res.status(status).json({ message });
}

module.exports = errorHandler;