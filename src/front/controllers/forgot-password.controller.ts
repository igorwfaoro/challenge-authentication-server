import { NextFunction, Request, Response, Router } from "express";

const ForgotPasswordController = Router();

ForgotPasswordController.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.render('forgot-password/view-forgot-password');
    } catch (error) {
        next(error);
    }
});

export { ForgotPasswordController };