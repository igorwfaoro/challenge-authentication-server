import { Router } from "express";
import { AuthController } from "./api/controllers/auth.controller";
import { VERSION } from "../version";
import { IndexController } from "./front/controllers/index.controller";
import { LoginController } from "./front/controllers/login.controller";
import { UsersController } from "./api/controllers/users.controller";

const router = Router(); 

// api
router.get('/api', (req, res) => res.json({
    name: 'challenge-authentication-server',
    version: VERSION
}));
router.use('/api/auth', AuthController);
router.use('/api/users', UsersController);

// front
router.use('/', IndexController);
router.use('/login', LoginController);

export { router };