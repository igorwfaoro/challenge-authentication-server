import { NextFunction, Request, Response, Router } from "express";
import { checkTokenString } from "../../api/middlewares/check-token";

const ResetPasswordController = Router();

ResetPasswordController.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        checkTokenString(<string>req.query.token);
        res.render('reset-password/view-reset-password');
    } catch (error) {
        res.redirect('/login?error=Invalid token');
    }
});

export { ResetPasswordController };