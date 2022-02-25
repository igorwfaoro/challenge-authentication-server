import { CustomException } from "./setup/custom.exception";

export class NotFoundException extends CustomException {

    constructor(message = 'Not found', statusCode = 404) {
        super(statusCode, message);
    }
}