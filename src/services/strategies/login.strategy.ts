import { WhereOptions } from "sequelize/types";
import { Address } from "../../models/entities/address";
import { Promotion } from "../../models/entities/promotion";
import { User } from "../../models/entities/user";
import { LoginInputModel } from "../../api/models/input-models/login.input-model";
import { UserTokenViewModel } from "../../api/models/view-models/user-token.view-model";
import { Strategy } from "../abstraction/strategy";
import * as bcrypt from 'bcryptjs';
import { AuthException } from "../../common/exceptions/auth.exception";
import { UserViewModel } from "../../api/models/view-models/user.view-model";
import { SalePoint } from "../../models/entities/sale-point";
import { UserPermissionException } from "../../common/exceptions/user-permission.exception";

export enum LoginStrategyType {
    MANAGER = 'MANAGER',
    NORMAL_USER = 'NORMAL_USER'
}

export class LoginStrategy extends Strategy<LoginInputModel, Promise<UserTokenViewModel>> {

    constructor(
        type: string,
        private makeToken: (user: User) => string
    ) {
        super(type, [LoginStrategyType.MANAGER, LoginStrategyType.NORMAL_USER], LoginStrategyType.NORMAL_USER);
    }

    public async [LoginStrategyType.MANAGER](input: LoginInputModel): Promise<UserTokenViewModel> {

        const user = await this.getUser({
            email: input.email
        });

        if (!user)
            throw new AuthException('Usuário ou senha inválida');

        if (!user.isManager)
            throw new UserPermissionException('Usuário não tem permissão');

        if (!user.salePointId)
            throw new UserPermissionException('Usuário não está vinculado a um ponto de venda');

        this.validatePassword(input.password, user.password);

        return {
            user: UserViewModel.fromEntity(user),
            token: this.makeToken(user)
        };
    }

    public async [LoginStrategyType.NORMAL_USER](input: LoginInputModel): Promise<UserTokenViewModel> {

        const user = await this.getUser({ email: input.email });

        if (!user)
            throw new AuthException('Usuário ou senha inválida');

        this.validatePassword(input.password, user.password);

        return {
            user: UserViewModel.fromEntity(user),
            token: this.makeToken(user)
        };
    }

    private async getUser(where: WhereOptions): Promise<User> {

        return await User.findOne({
            where,
            include: [
                {
                    model: Address,
                    as: 'address'
                },
                {
                    model: SalePoint,
                    as: 'salePoint'
                }
            ]
        });
    }

    private validatePassword(inputPassword: string, hash: string): void {
        if (!bcrypt.compareSync(inputPassword, hash))
            throw new AuthException('Usuário ou senha inválida');
    }
}