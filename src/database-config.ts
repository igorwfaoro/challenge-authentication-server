import { injectable } from "inversify";
import { CONFIG } from "./config";
import { Sequelize } from 'sequelize-typescript';
import { User } from "./models/entities/user";

@injectable()
export class Database {
    public readonly sequelize: Sequelize

    constructor() {
        this.sequelize = new Sequelize(CONFIG.DB_SCHEMA, CONFIG.DB_USER, CONFIG.DB_PASSWORD, {
            host: CONFIG.DB_HOST,
            dialect: 'mysql',
            dialectOptions: {
                decimalNumbers: true,
                useUTC: true, // for reading from database,
            },
            timezone: '+00:00', // for writing to database
        });

        this.sequelize.addModels([
            User
        ]);
    }
}