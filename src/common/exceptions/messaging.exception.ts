
import { CustomException } from "./setup/custom.exception";

export class MessagingException extends CustomException {

    constructor(message = 'Something wrong sending messages', statusCode = 400) {
        super(statusCode, message);
    }
}