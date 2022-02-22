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
import { Address } from "../models/entities/address";
import { UserRegisterInputModel } from "../api/models/input-models/user-register.input-model";
import { Transaction } from "sequelize/types";
import { Database } from "../data/database-config";
import { GeocodingService } from "./geocoding.service";
import { AddressHelper } from "../common/helpers/address.helper";
import { UserException } from "../common/exceptions/user.exception";
import { StringHelper } from "../common/helpers/string.helper";
import { LoginStrategy } from "./strategies/login.strategy";
import { SalePoint } from "../models/entities/sale-point";

@injectable()
export class AuthService {

    constructor(
        @inject(Database) private _database: Database,
        @inject(GeocodingService) private _geocodingService: GeocodingService
    ) { }

    public async login(input: LoginInputModel, strategy: string): Promise<UserTokenViewModel> {

        return await (new LoginStrategy(
            strategy,
            user => this.makeToken(user)
        ).call(input))
    }

    public async register(input: UserRegisterInputModel): Promise<UserTokenViewModel> {

        const transaction: Transaction = await this._database.sequelize.transaction();

        try {
            const address = Address.create({
                description: input.address.description,
                street: input.address.street,
                number: input.address.number,
                zipCode: input.address.zipCode,
                neighborhood: input.address.neighborhood,
                city: input.address.city,
                region: input.address.region,
                country: input.address.country,
                complement: input.address.complement,
                referencePoint: input.address.referencePoint
            });

            const coordinates = await this._geocodingService.addressToCoordinates(
                AddressHelper.format(address, { includeComplement: false })
            );

            if (!coordinates)
                throw new UserException('Erro ao buscar endereço. Por favor revise.');

            address.latitude = coordinates.latitude;
            address.longitude = coordinates.longitude;

            await address.save();

            const user = User.create({
                name: input.name,
                email: input.email,
                password: bcrypt.hashSync(input.password),
                phone: StringHelper.getOnlyNumbers(input.phone),
                addressId: address.id
            });

            await user.save();

            await transaction.commit();

            return {
                user: UserViewModel.fromEntity(user),
                token: this.makeToken(user)
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async refresh(tokenPayload: TokenPayload) {

        const user: User = await User.findOne({
            where: { id: tokenPayload.userId },
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

        if (!user)
            throw new NotFoundException('Usuário não encontrado');

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