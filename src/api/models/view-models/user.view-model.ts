import { User } from "../../../models/entities/user";
import { DateHelper } from "../../../common/helpers/date.helper";
import { AddressViewModel } from "./address.view-model";
import { AddressHelper } from "../../../common/helpers/address.helper";
import { SalePointViewModel } from "./sale-point.view-model";

export class UserViewModel {

    public id: number;
    public key: string;
    public name: string;
    public email: string;
    public phone?: string;
    public address?: AddressViewModel;
    public addressDescription?: string;
    public fullAddress?: string;
    public salePoint?: SalePointViewModel;
    public createdAt: string;
    public updatedAt: string;

    public static fromEntity(u: User): UserViewModel {

        if (!u) return null;

        const user = new UserViewModel();

        user.id = u.id;
        user.key = u.key;
        user.name = u.name;
        user.email = u.email;
        user.phone = u.phone;
        user.address = AddressViewModel.fromEntity(u.address);
        user.addressDescription = AddressHelper.format(u.address);
        user.fullAddress = AddressHelper.format(u.address, { includeComplement: true });
        user.salePoint = SalePointViewModel.fromEntity(u.salePoint);
        user.createdAt = DateHelper.toStringViewModel(u.createdAt);
        user.updatedAt = DateHelper.toStringViewModel(u.updatedAt);

        return user;
    }
}