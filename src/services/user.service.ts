import { inject, injectable } from "inversify";
import { Includeable, Transaction } from "sequelize";
import { NotFoundException } from "../common/exceptions/not-found.exception";
import { UserException } from "../common/exceptions/user.exception";
import { AddressHelper } from "../common/helpers/address.helper";
import { Database } from "../data/database-config";
import { Address } from "../models/entities/address";
import { User } from "../models/entities/user";
import { AddressInputModel } from "../api/models/input-models/address.input-model";
import { UserUpdateInputModel } from "../api/models/input-models/user-update.input-model";
import { AddressViewModel } from "../api/models/view-models/address.view-model";
import { UserViewModel } from "../api/models/view-models/user.view-model";
import { GeocodingService } from "./geocoding.service";

@injectable()
export class UserService {

    constructor(
        @inject(GeocodingService) private _geocodingService: GeocodingService,
        @inject(Database) private _database: Database
    ) { }

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

        const user = await this.getEntityById(userId, [
            {
                model: Address,
                as: 'address'
            }
        ]);

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        return UserViewModel.fromEntity(user);
    }

    public async updateAddress(input: AddressInputModel, userId: number): Promise<AddressViewModel> {

        const user = await this.getEntityById(userId, [
            {
                model: Address,
                as: 'address'
            }
        ]);

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            if (user.address) {
                user.address.description = input.description;
                user.address.street = input.street;
                user.address.number = input.number;
                user.address.zipCode = input.zipCode;
                user.address.neighborhood = input.neighborhood;
                user.address.city = input.city;
                user.address.region = input.region;
                user.address.country = input.country;
                user.address.complement = input.complement;
                user.address.referencePoint = input.referencePoint;
                user.address.latitude = input.latitude;
                user.address.longitude = input.longitude;

                await user.address.save({ transaction });
            } else {
                const newAddress = Address.create({
                    description: input.description,
                    street: input.street,
                    number: input.number,
                    zipCode: input.zipCode,
                    neighborhood: input.neighborhood,
                    city: input.city,
                    region: input.region,
                    country: input.country,
                    complement: input.complement,
                    referencePoint: input.referencePoint,
                    latitude: input.latitude,
                    longitude: input.longitude
                });

                await newAddress.save({ transaction });

                user.address = newAddress;
                user.addressId = newAddress.id;

                await user.save({ transaction });
            }

            const coordinates = await this._geocodingService.addressToCoordinates(
                AddressHelper.format(user.address, { includeComplement: false })
            );

            if (!coordinates)
                throw new UserException('Erro ao buscar endereço. Por favor revise.');

            user.address.latitude = coordinates.latitude;
            user.address.longitude = coordinates.longitude;

            await user.address.save({ transaction });

            await transaction.commit();

            return AddressViewModel.fromEntity(user.address);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async update(input: UserUpdateInputModel, userId: number): Promise<UserViewModel> {

        const user = await this.getEntityById(userId, [
            {
                model: Address,
                as: 'address'
            }
        ]);

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            if (user.address) {
                user.address.description = input.address.description;
                user.address.street = input.address.street;
                user.address.number = input.address.number;
                user.address.zipCode = input.address.zipCode;
                user.address.neighborhood = input.address.neighborhood;
                user.address.city = input.address.city;
                user.address.region = input.address.region;
                user.address.country = input.address.country;
                user.address.complement = input.address.complement;
                user.address.referencePoint = input.address.referencePoint;
                user.address.latitude = input.address.latitude;
                user.address.longitude = input.address.longitude;

                await user.address.save({ transaction });
            } else {
                const newAddress = Address.create({
                    description: input.address.description,
                    street: input.address.street,
                    number: input.address.number,
                    zipCode: input.address.zipCode,
                    neighborhood: input.address.neighborhood,
                    city: input.address.city,
                    region: input.address.region,
                    country: input.address.country,
                    complement: input.address.complement,
                    referencePoint: input.address.referencePoint,
                    latitude: input.address.latitude,
                    longitude: input.address.longitude
                });

                await newAddress.save({ transaction });

                user.address = newAddress;
                user.addressId = newAddress.id;
            }

            const coordinates = await this._geocodingService.addressToCoordinates(
                AddressHelper.format(user.address, { includeComplement: false })
            );

            if (!coordinates)
                throw new UserException('Erro ao buscar endereço. Por favor revise.');

            user.address.latitude = coordinates.latitude;
            user.address.longitude = coordinates.longitude;

            await user.address.save({ transaction });

            user.name = input.name;
            user.email = input.email;
            user.phone = input.phone;

            await user.save({ transaction });

            await transaction.commit();

            return UserViewModel.fromEntity(user);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }
}