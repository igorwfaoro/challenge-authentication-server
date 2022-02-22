import { CustomException } from "./setup/custom.exception";

export class UserPermissionException extends CustomException {

    constructor(message = 'Usuário não tem permissão para está ação', statusCode = 403) {
        super(statusCode, message);
    }
}