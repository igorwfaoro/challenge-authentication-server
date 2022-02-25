import { CustomException } from "./setup/custom.exception";

export class AuthException extends CustomException {

    constructor(message = 'Authentication error', statusCode = 401) {
        super(statusCode, message);
    }
}