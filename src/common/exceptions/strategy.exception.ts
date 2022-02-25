import { CustomException } from "./setup/custom.exception";

export class StrategyException extends CustomException {

    constructor(message = 'Something wrong...', statusCode = 400) {
        super(statusCode, message);
    }
}