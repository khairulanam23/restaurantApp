import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const OrderLine = sequelize.define("OrderLine", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Order", key: "id" },
    onDelete: "CASCADE",
  },
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "MenuItem", key: "id" },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 99 },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  lineTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "served",
      "cancelled"
    ),
    defaultValue: "pending",
  },
  specialInstructions: DataTypes.TEXT,
  customization: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  chefNotes: DataTypes.TEXT,
  preparedBy: DataTypes.UUID,
  startedAt: DataTypes.DATE,
  completedAt: DataTypes.DATE,
  servedAt: DataTypes.DATE,
  cancelledReason: DataTypes.TEXT,
  cancelledBy: DataTypes.UUID,
});
