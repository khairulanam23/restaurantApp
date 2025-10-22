import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userId: DataTypes.UUID,
    userRole: DataTypes.STRING(50),
    oldValues: DataTypes.JSON,
    newValues: DataTypes.JSON,
    ipAddress: DataTypes.STRING(45),
    userAgent: DataTypes.TEXT,
    severity: {
      type: DataTypes.ENUM("info", "warning", "error", "critical"),
      defaultValue: "info",
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);
