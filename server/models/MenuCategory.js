import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MenuCategory = sequelize.define("MenuCategory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [1, 100] },
  },
  description: DataTypes.TEXT,
  type: {
    type: DataTypes.ENUM(
      "breakfast",
      "lunch",
      "dinner",
      "buffet_lunch",
      "buffet_dinner",
      "all_day",
      "beverages"
    ),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  startTime: DataTypes.TIME,
  endTime: DataTypes.TIME,
  daysAvailable: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
  minPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  maxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  imageUrl: DataTypes.STRING(500),
});
