import { injectable } from "inversify";
import { Includeable } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-found.exception";
import { User } from "../models/entities/user";
import { UserViewModel } from "../api/models/view-models/user.view-model";

@injectable()
export class UserService {

    public async getEntityById(userId: number, include: Includeable[] = []): Promise<User> {

        const user: User = await User.findOne({
            where: {
                id: userId
            },
            include
        });

        if (!user)
            throw new NotFoundException('User not found');

        return user;
    }

    public async getLogged(userId: number): Promise<UserViewModel> {

        const user = await this.getEntityById(userId);

        if (!user)
            throw new NotFoundException('User not found');

        return UserViewModel.fromEntity(user);
    }
}