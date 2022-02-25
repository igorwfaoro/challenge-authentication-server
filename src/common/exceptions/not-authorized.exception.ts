import { CustomException } from "./setup/custom.exception";

export class NotAuthorizedException extends CustomException {

    constructor(message = 'Unauthorized', statusCode = 404) {
        super(statusCode, message);
    }
}