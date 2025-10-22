import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  tableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Table", key: "id" },
  },
  customerCount: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 50 },
  },
  status: {
    type: DataTypes.ENUM(
      "draft",
      "open",
      "confirmed",
      "in_kitchen",
      "ready",
      "served",
      "cancelled",
      "paid",
      "refunded"
    ),
    defaultValue: "draft",
  },
  priority: {
    type: DataTypes.ENUM("low", "normal", "high", "urgent"),
    defaultValue: "normal",
  },
  type: {
    type: DataTypes.ENUM("dine_in", "takeaway", "delivery"),
    defaultValue: "dine_in",
  },
  serverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "User", key: "id" },
  },
  customerNotes: DataTypes.TEXT,
  kitchenNotes: DataTypes.TEXT,
  estimatedReadyTime: DataTypes.DATE,
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  serviceCharge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  grandTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0.1,
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0.0,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  changeDue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  isTakeaway: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  servedAt: DataTypes.DATE,
  paidAt: DataTypes.DATE,
});
