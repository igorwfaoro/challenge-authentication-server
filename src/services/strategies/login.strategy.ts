import { WhereOptions } from "sequelize/types";
import { User } from "../../models/entities/user";
import { LoginInputModel } from "../../api/models/input-models/login.input-model";
import { UserTokenViewModel } from "../../api/models/view-models/user-token.view-model";
import { Strategy } from "../abstraction/strategy";
import * as bcrypt from 'bcryptjs';
import { AuthException } from "../../common/exceptions/auth.exception";
import { UserViewModel } from "../../api/models/view-models/user.view-model";

export enum LoginStrategyType {
    JWT = 'JWT'
}

export class LoginStrategy extends Strategy<LoginInputModel, Promise<UserTokenViewModel>> {

    constructor(
        type: string,
        private makeToken: (user: User) => string
    ) {
        super(type, Object.values(LoginStrategyType), LoginStrategyType.JWT);
    }

    public async [LoginStrategyType.JWT](input: LoginInputModel): Promise<UserTokenViewModel> {

        const user = await this.getUser({
            email: input.email
        });

        if (!user)
            throw new AuthException('Invalid email or password');

        this.validatePassword(input.password, user.password);

        return {
            user: UserViewModel.fromEntity(user),
            token: this.makeToken(user)
        };
    }

    private async getUser(where: WhereOptions): Promise<User> {
        return await User.findOne({ where });
    }

    private validatePassword(inputPassword: string, hash: string): void {
        if (!bcrypt.compareSync(inputPassword, hash))
            throw new AuthException('Invalid email or password');
    }
}