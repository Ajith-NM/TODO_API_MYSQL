import { sequelize } from "../config/DB_connection.js";
import { DataTypes } from "sequelize";
export const Users = sequelize.define("Users", {
  user_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING,},
  email: { type: DataTypes.STRING, allowNull: false },
  profilePic: { type: DataTypes.STRING },
  otp: { type: DataTypes.STRING },
});
