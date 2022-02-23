import { inject, injectable } from "inversify";
import { Includeable } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-found.exception";
import { Database } from "../data/database-config";
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
            throw new NotFoundException('Usuário não encontrado');

        return user;
    }

    public async getLogged(userId: number): Promise<UserViewModel> {

        const user = await this.getEntityById(userId);

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        return UserViewModel.fromEntity(user);
    }
}