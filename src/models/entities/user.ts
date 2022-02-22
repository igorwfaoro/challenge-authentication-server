import { AllowNull, BelongsTo, Column, CreatedAt, Default, ForeignKey, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";
import { Address } from "./address";
import { SalePoint } from './sale-point';
import { v4 as uuidV4 } from 'uuid';

@Table({
    tableName: 'Users',
    timestamps: true
})
export class User extends Entity<User> {

    public static create(input: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        addressId: number;
    }): User {
        const user = new User(input);
        user.key = uuidV4();
        return user;
    }

    @AllowNull(false)
    @Unique
    @Column
    public key: string;

    @AllowNull(false)
    @Column
    public name: string;

    @AllowNull(false)
    @Unique
    @Column
    public email: string;

    @AllowNull(false)
    @Column
    public password: string;

    @Column
    public phone?: string;

    @ForeignKey(() => Address)
    @Column
    public addressId?: number;
    @BelongsTo(() => Address, 'addressId')
    public address?: Address;

    @ForeignKey(() => SalePoint)
    @Column
    public salePointId?: number;
    @BelongsTo(() => SalePoint, 'salePointId')
    public salePoint?: SalePoint;

    @AllowNull(false)
    @Default(false)
    @Column
    public isManager: boolean;

    @AllowNull(false)
    @Default(true)
    @Column
    public isActive: boolean;

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}