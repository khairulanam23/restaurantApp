import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "Order", key: "id" },
  },
  paymentNumber: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  paymentMethod: {
    type: DataTypes.ENUM(
      "cash",
      "credit_card",
      "debit_card",
      "digital_wallet",
      "voucher",
      "multiple"
    ),
    allowNull: false,
  },
  paymentDetails: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  transactionId: DataTypes.STRING(255),
  status: {
    type: DataTypes.ENUM(
      "pending",
      "processing",
      "completed",
      "failed",
      "refunded",
      "partially_refunded"
    ),
    defaultValue: "pending",
  },
  changeGiven: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  tipAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  processedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "User", key: "id" },
  },
  failureReason: DataTypes.TEXT,
  refundReason: DataTypes.TEXT,
  refundedBy: DataTypes.UUID,
  completedAt: DataTypes.DATE,
});
