import { NextFunction, Request, Response, Router } from "express";
import { ServicesCollection } from "../../providers";
import { TokenHelper } from "../../common/helpers/token.helper";
import { UserService } from "../../services/user.service";
import { checkToken } from "../middlewares/check-token";

const UsersController = Router();

const userService = ServicesCollection.resolve(UserService);

UsersController.get('/logged', checkToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getLogged(TokenHelper.getPayload(res).userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

UsersController.put('/address', checkToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await userService.updateAddress(req.body, TokenHelper.getPayload(res).userId);
        res.json(address);
    } catch (error) {
        next(error);
    }
});

UsersController.put('/', checkToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.update(req.body, TokenHelper.getPayload(res).userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

export { UsersController };