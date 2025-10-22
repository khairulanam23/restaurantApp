import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MenuItem = sequelize.define("MenuItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { len: [1, 255] },
  },
  description: DataTypes.TEXT,
  shortDescription: DataTypes.STRING(100),
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  costPrice: DataTypes.DECIMAL(10, 2),
  imageUrl: {
    type: DataTypes.STRING(500),
    validate: { isUrl: true },
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "MenuCategory", key: "id" },
  },
  subcategories: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 480 },
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isRecommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ingredients: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  allergens: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  nutritionalInfo: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  spiceLevel: {
    type: DataTypes.ENUM("mild", "medium", "hot", "very_hot"),
    defaultValue: "mild",
  },
  maxDailyQuantity: DataTypes.INTEGER,
  todaySold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  customizationOptions: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});
