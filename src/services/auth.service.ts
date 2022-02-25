import { inject, injectable } from "inversify";
import { LoginInputModel } from "../api/models/input-models/login.input-model";
import { NotFoundException } from "../common/exceptions/not-found.exception";
import * as jwt from 'jsonwebtoken';
import { CONFIG } from "../config";
import { TokenPayload } from "../common/helpers/token.helper";
import { User } from "../models/entities/user";
import { UserViewModel } from "../api/models/view-models/user.view-model";
import { UserTokenViewModel } from "../api/models/view-models/user-token.view-model";
import * as bcrypt from 'bcryptjs';
import { Database } from "../database-config";
import { LoginStrategy } from "./strategies/login.strategy";
import { UserRegisterInputModel } from "../api/models/input-models/user-register";

@injectable()
export class AuthService {

    constructor(
        @inject(Database) private _database: Database
    ) { }

    public async login(input: LoginInputModel, strategy: string): Promise<UserTokenViewModel> {

        return await (new LoginStrategy(
            strategy,
            user => this.makeToken(user)
        ).call(input))
    }

    public async register(input: UserRegisterInputModel): Promise<UserTokenViewModel> {

        const user = User.createModel({
            name: input.name,
            email: input.email,
            password: bcrypt.hashSync(input.password)
        });

        await user.save();

        return {
            user: UserViewModel.fromEntity(user),
            token: this.makeToken(user)
        };
    }

    public async refresh(tokenPayload: TokenPayload) {

        const user: User = await User.findOne({
            where: { id: tokenPayload.userId }
        });

        if (!user)
            throw new NotFoundException('User not found');

        const token = this.makeToken(user);

        return {
            user: UserViewModel.fromEntity(user),
            token
        };
    }

    public makeToken(user: User): string {

        const payload: TokenPayload = { userId: user.id };

        const token = jwt.sign(
            payload,
            CONFIG.JWT_SECRET,
            { expiresIn: "120h" }
        );

        return token;
    }
}