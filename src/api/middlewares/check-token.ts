import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { CONFIG } from '../../config';
import { AuthException } from "../../common/exceptions/auth.exception";

export function checkToken(req: Request, res: Response, next: NextFunction) {

    const token = <string>req.headers["authorization"];
    let jwtPayload;

    try {
        const onlyToken = token.split(' ')[1];

        jwtPayload = checkTokenString(onlyToken);

        res.locals.jwtPayload = jwtPayload;
        res.locals.jwtToken = onlyToken;
    } catch (error) {
        next(new AuthException());
    }

    next();
};

export function checkTokenString(token: string): string | jwt.JwtPayload {
    try {
        return jwt.verify(token, CONFIG.JWT_SECRET);
    } catch {
        throw new AuthException();
    }
}