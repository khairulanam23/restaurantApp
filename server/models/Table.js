import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Table = sequelize.define("Table", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: { min: 1, max: 999 },
  },
  tableName: {
    type: DataTypes.STRING(50),
    validate: { len: [0, 50] },
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 20 },
  },
  status: {
    type: DataTypes.ENUM(
      "free",
      "occupied",
      "reserved",
      "cleaning",
      "out_of_order"
    ),
    defaultValue: "free",
  },
  location: {
    type: DataTypes.ENUM(
      "main_hall",
      "patio",
      "private_room",
      "bar_area",
      "terrace"
    ),
    defaultValue: "main_hall",
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  currentOrderId: DataTypes.UUID,
  notes: DataTypes.TEXT,
});
