import { Sequelize } from 'sequelize';
import dotenv from "dotenv"
dotenv.config()

export const sequelize = new Sequelize(process.env.DBName, process.env.user, process.env.sqlPassword, {
    host: process.env.host,
    dialect: 'mysql',
    logging: false, // Set to true if you want to see SQL queries in the console
});