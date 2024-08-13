import { sequelize } from "../config/DB_connection.js";
import { DataTypes } from "sequelize";
import { Users } from "./usermodel.js";
export const Tasks = sequelize.define("Tasks", {
  task_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  user_Id: { type: DataTypes.INTEGER, allowNull: false },
});
Users.hasMany(Tasks, { foreignKey: "user_Id" });
