import { NextFunction, Request, Response, Router } from "express";

const SignupController = Router();

SignupController.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.render('signup/view-signup');
    } catch (error) {
        next(error);
    }
});

export { SignupController };