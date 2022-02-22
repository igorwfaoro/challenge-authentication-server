import { Router } from "express";
import { AuthController } from "./api/controllers/auth.controller";
import { ProductsController } from "./api/controllers/product.controller";
import { PurchaseOrdersController } from "./api/controllers/purchase-orders.controller";
import { VERSION } from "../version";
import { UsersController } from "./api/controllers/users.controller";
import { SalePointsController } from "./api/controllers/sale-points.controller";
import { PromotionsController } from "./api/controllers/promotions.controller";

const routes = Router(); 

routes.get('/', (req, res) => res.json({
    name: 'challenge-authentication-server',
    version: VERSION
}));

// api
routes.use('/api/auth', AuthController);

// front
routes.use('/', AuthController);

export { routes };