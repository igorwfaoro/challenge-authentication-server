import { NextFunction, Request, Response, Router } from "express";

const IndexController = Router();

IndexController.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.render('index/view-index');
    } catch (error) {
        next(error);
    }
});

export { IndexController };