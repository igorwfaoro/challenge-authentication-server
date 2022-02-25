import { Response } from "express";

export class TokenHelper {

    public static getPayload(res: Response): TokenPayload {
        const payload = res.locals.jwtPayload;
        return payload;
    }

    public static getToken(res: Response): string {
        const token = res.locals.jwtToken;
        return token;
    }
}

export interface TokenPayload {
    userId: number;
}