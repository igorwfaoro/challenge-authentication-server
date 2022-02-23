import { Model, PrimaryKey, AutoIncrement, Column, AllowNull } from "sequelize-typescript";

export abstract class Entity extends Model{
    
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column({
        field: 'ID'
    })
    public id: number;
}