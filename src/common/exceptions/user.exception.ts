import { CustomException } from "./setup/custom.exception";

export class UserException extends CustomException {

    constructor(message = 'Something wrong...', statusCode = 400) {
        super(statusCode, message);
    }
}