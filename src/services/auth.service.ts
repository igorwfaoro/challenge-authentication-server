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
import { LoginStrategy } from "./strategies/login.strategy";
import { UserRegisterInputModel } from "../api/models/input-models/user-register";
import { ForgotPasswordInputModel } from "../api/models/input-models/forgot-password.input-model";
import { MessagingService } from './messaging.service';
import { ResetPasswordInputModel } from "../api/models/input-models/reset-password.input-model";

@injectable()
export class AuthService {

    constructor(
        @inject(MessagingService) private _messagingService: MessagingService,
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

    public async forgotPassword(input: ForgotPasswordInputModel): Promise<void> {

        const user: User = await User.findOne({
            where: { email: input.email }
        });

        if (user) {
            user.resetPasswordToken = this.makeToken(user, { expiresIn: '1h' });
            await user.save();

            this._messagingService.sendEmail({
                emails: [input.email],
                subject: 'Reset Password - Jade Dragon Authentication Server',
                message: /*html*/`
                    <html>
                        <p>You have requested to reset your password.</p>
                        <p>
                            <a href="${CONFIG.PUBLIC_ADDRESS}/reset-password?token=${user.resetPasswordToken}">Click here</a> to reset your password.
                        </p>
                    </html>
                `
            });
        }
    }

    public async resetPassword(input: ResetPasswordInputModel, userId: number, token: string): Promise<void> {

        const user: User = await User.findOne({
            where: { id: userId }
        });

        if (!user)
            throw new NotFoundException('User not found');

        if (user.resetPasswordToken != token)
            throw new NotFoundException('Invalid token');

        user.password = bcrypt.hashSync(input.password);
        user.resetPasswordToken = null;

        await user.save();
    }

    public makeToken(user: User, options: { expiresIn?: string } = {}): string {

        const payload: TokenPayload = { userId: user.id };

        const token = jwt.sign(
            payload,
            CONFIG.JWT_SECRET,
            { expiresIn: options.expiresIn || '120h' }
        );

        return token;
    }
}