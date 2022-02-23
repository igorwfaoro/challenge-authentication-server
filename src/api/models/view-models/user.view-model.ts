import { User } from "../../../models/entities/user";
import { DateHelper } from "../../../common/helpers/date.helper";

export class UserViewModel {

    public id: number;
    public name: string;
    public email: string;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(u: User): UserViewModel {

        if (!u) return null;

        const user = new UserViewModel();

        user.id = u.id;
        user.name = u.name;
        user.email = u.email;
        user.createdAt = DateHelper.toStringViewModel(u.createdAt);
        user.updatedAt = DateHelper.toStringViewModel(u.updatedAt);

        return user;
    }
}