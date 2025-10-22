import { User } from "./User.js";
import { Table } from "./Table.js";
import { MenuCategory } from "./MenuCategory.js";
import { MenuItem } from "./MenuItem.js";
import { Order } from "./Order.js";
import { OrderLine } from "./OrderLine.js";
import { Payment } from "./Payment.js";
import { AuditLog } from "./AuditLog.js";

// Define Associations
User.hasMany(Order, { foreignKey: "serverId", as: "orders" });
Order.belongsTo(User, { foreignKey: "serverId", as: "server" });

Table.hasMany(Order, { foreignKey: "tableId", as: "orders" });
Order.belongsTo(Table, { foreignKey: "tableId", as: "table" });

MenuCategory.hasMany(MenuItem, { foreignKey: "categoryId", as: "items" });
MenuItem.belongsTo(MenuCategory, { foreignKey: "categoryId", as: "category" });

Order.hasMany(OrderLine, { foreignKey: "orderId", as: "lines" });
OrderLine.belongsTo(Order, { foreignKey: "orderId", as: "order" });

MenuItem.hasMany(OrderLine, { foreignKey: "menuItemId", as: "orderLines" });
OrderLine.belongsTo(MenuItem, { foreignKey: "menuItemId", as: "menuItem" });

Order.hasMany(Payment, { foreignKey: "orderId", as: "payments" });
Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

User.hasMany(Payment, { foreignKey: "processedBy", as: "processedPayments" });
Payment.belongsTo(User, { foreignKey: "processedBy", as: "processor" });

export {
  User,
  Table,
  MenuCategory,
  MenuItem,
  Order,
  OrderLine,
  Payment,
  AuditLog,
};
