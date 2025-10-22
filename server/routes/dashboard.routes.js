import express from "express";
import {
  Order,
  Payment,
  OrderLine,
  MenuItem,
  User,
  Table,
} from "../models/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { Op, fn, col } from "sequelize";

const router = express.Router();

// Dashboard Stats
router.get(
  "/stats",
  authenticate,
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalOrders = await Order.count({
      where: { createdAt: { [Op.gte]: startOfDay } },
    });

    const totalRevenue = await Payment.sum("amount", {
      where: {
        createdAt: { [Op.gte]: startOfDay },
        status: "completed",
      },
    });

    const activeOrders = await Order.count({
      where: {
        status: { [Op.in]: ["open", "confirmed", "in_kitchen", "ready"] },
      },
    });

    const completedOrders = await Order.count({
      where: { status: "paid", createdAt: { [Op.gte]: startOfDay } },
    });

    const occupiedTables = await Table.count({
      where: { status: "occupied" },
    });

    const totalTables = await Table.count({
      where: { isActive: true },
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue || 0,
        activeOrders,
        completedOrders,
        occupiedTables,
        totalTables,
        tableOccupancyRate:
          totalTables > 0
            ? ((occupiedTables / totalTables) * 100).toFixed(2)
            : 0,
      },
    });
  })
);

// Dashboard Overview
router.get(
  "/overview",
  authenticate,
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.findAll({
      where: { createdAt: { [Op.gte]: startOfDay } },
      attributes: ["status"],
    });

    const payments = await Payment.findAll({
      where: {
        createdAt: { [Op.gte]: startOfDay },
        status: "completed",
      },
      attributes: ["paymentMethod", "amount"],
    });

    const ordersByStatus = {};
    orders.forEach((order) => {
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    const paymentsByMethod = {};
    payments.forEach((payment) => {
      paymentsByMethod[payment.paymentMethod] =
        (paymentsByMethod[payment.paymentMethod] || 0) + 1;
    });

    const totalRevenue = payments.reduce(
      (sum, p) => sum + Number.parseFloat(p.amount),
      0
    );

    res.json({
      success: true,
      data: {
        ordersByStatus,
        paymentsByMethod,
        totalRevenue,
        totalTransactions: payments.length,
      },
    });
  })
);

// Daily Sales Report
router.get(
  "/reports/sales/daily",
  authenticate,
  asyncHandler(async (req, res) => {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const sales = await Payment.findAll({
      where: {
        createdAt: { [Op.between]: [targetDate, nextDay] },
        status: "completed",
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "transactions"],
        [fn("SUM", col("amount")), "total"],
        [fn("SUM", col("tipAmount")), "tips"],
      ],
      group: [fn("DATE", col("createdAt"))],
      raw: true,
    });

    res.json({ success: true, data: { sales } });
  })
);

// Weekly Sales Report
router.get(
  "/reports/sales/weekly",
  authenticate,
  asyncHandler(async (req, res) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const sales = await Payment.findAll({
      where: {
        createdAt: { [Op.between]: [startOfWeek, endOfWeek] },
        status: "completed",
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("amount")), "total"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
      raw: true,
    });

    res.json({ success: true, data: { sales } });
  })
);

// Monthly Sales Report
router.get(
  "/reports/sales/monthly",
  authenticate,
  asyncHandler(async (req, res) => {
    const { year, month } = req.query;
    const currentDate = new Date();
    const targetYear = year ? Number.parseInt(year) : currentDate.getFullYear();
    const targetMonth = month
      ? Number.parseInt(month) - 1
      : currentDate.getMonth();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 1);

    const sales = await Payment.findAll({
      where: {
        createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
        status: "completed",
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("amount")), "total"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
      raw: true,
    });

    res.json({ success: true, data: { sales } });
  })
);

// Popular Items Report
router.get(
  "/reports/items/popular",
  authenticate,
  asyncHandler(async (req, res) => {
    const items = await OrderLine.findAll({
      attributes: [
        "menuItemId",
        [fn("COUNT", col("id")), "count"],
        [fn("SUM", col("lineTotal")), "revenue"],
      ],
      group: ["menuItemId"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      limit: 10,
      include: [
        { model: MenuItem, as: "menuItem", attributes: ["name", "price"] },
      ],
      raw: true,
      subQuery: false,
    });

    res.json({ success: true, data: { items } });
  })
);

// Table Performance Report
router.get(
  "/reports/tables/performance",
  authenticate,
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const tables = await Table.findAll({
      attributes: ["id", "tableNumber", "capacity"],
      include: [
        {
          model: Order,
          as: "orders",
          where: { createdAt: { [Op.gte]: startOfDay } },
          attributes: ["id", "grandTotal"],
          required: false,
        },
      ],
    });

    const performance = tables.map((table) => ({
      tableId: table.id,
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      ordersCount: table.orders.length,
      totalRevenue: table.orders.reduce(
        (sum, order) => sum + Number.parseFloat(order.grandTotal),
        0
      ),
      averageOrderValue:
        table.orders.length > 0
          ? (
              table.orders.reduce(
                (sum, order) => sum + Number.parseFloat(order.grandTotal),
                0
              ) / table.orders.length
            ).toFixed(2)
          : 0,
    }));

    res.json({ success: true, data: { performance } });
  })
);

// Staff Performance Report
router.get(
  "/reports/staff/performance",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const staff = await User.findAll({
      where: { role: "server" },
      attributes: ["id", "username", "email"],
      include: [
        {
          model: Order,
          as: "servedOrders",
          where: { createdAt: { [Op.gte]: startOfDay } },
          attributes: ["id", "grandTotal"],
          required: false,
        },
      ],
    });

    const performance = staff.map((user) => ({
      userId: user.id,
      username: user.username,
      ordersCount: user.servedOrders.length,
      totalRevenue: user.servedOrders.reduce(
        (sum, order) => sum + Number.parseFloat(order.grandTotal),
        0
      ),
      averageOrderValue:
        user.servedOrders.length > 0
          ? (
              user.servedOrders.reduce(
                (sum, order) => sum + Number.parseFloat(order.grandTotal),
                0
              ) / user.servedOrders.length
            ).toFixed(2)
          : 0,
    }));

    res.json({ success: true, data: { performance } });
  })
);

// System Notifications
router.get(
  "/notifications",
  authenticate,
  asyncHandler(async (req, res) => {
    const notifications = [];

    // Low stock items
    const lowStockItems = await MenuItem.findAll({
      where: { maxDailyQuantity: { [Op.gt]: 0 } },
      attributes: ["id", "name", "maxDailyQuantity", "todaySold"],
    });

    lowStockItems.forEach((item) => {
      if (item.todaySold >= item.maxDailyQuantity * 0.8) {
        notifications.push({
          id: `low-stock-${item.id}`,
          type: "warning",
          message: `${item.name} is running low (${item.todaySold}/${item.maxDailyQuantity} sold)`,
          timestamp: new Date(),
        });
      }
    });

    // Pending orders
    const pendingOrders = await Order.count({
      where: { status: { [Op.in]: ["confirmed", "in_kitchen"] } },
    });

    if (pendingOrders > 0) {
      notifications.push({
        id: "pending-orders",
        type: "info",
        message: `${pendingOrders} orders pending in kitchen`,
        timestamp: new Date(),
      });
    }

    res.json({ success: true, data: { notifications } });
  })
);

// Dismiss Notification
router.post(
  "/notifications/:id/dismiss",
  authenticate,
  asyncHandler(async (req, res) => {
    // In production, store dismissed notifications in database
    res.json({ success: true, message: "Notification dismissed" });
  })
);

export default router;
