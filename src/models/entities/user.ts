import { AllowNull, Column, CreatedAt, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { Entity } from "../abstraction/entity";

@Table({
    tableName: 'Users',
    timestamps: true
})
export class User extends Entity {

    public static createModel(input: {
        name: string;
        email: string;
        password: string;
    }): User {
        return new User(input);
    }

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

    @AllowNull(false)
    @CreatedAt
    @Column
    public createdAt: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    public updatedAt: Date;
}