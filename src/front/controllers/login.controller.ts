import { NextFunction, Request, Response, Router } from "express";

const LoginController = Router();

LoginController.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.render('login/view-login');
    } catch (error) {
        next(error);
    }
});

export { LoginController };