import express from "express";
import { Payment, Order, User, AuditLog, OrderLine } from "../models/index.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import { Op } from "sequelize";

const router = express.Router();

// Generate Payment Number
const generatePaymentNumber = async () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await Payment.count({
    where: {
      createdAt: {
        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });
  return `PAY-${date}-${String(count + 1).padStart(3, "0")}`;
};

// List Payments
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;

    const payments = await Payment.findAll({
      where,
      include: [
        { model: Order, as: "order" },
        { model: User, as: "processor", attributes: ["id", "username"] },
      ],
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    const total = await Payment.count({ where });

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Get Today's Payments
router.get(
  "/today",
  authenticate,
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const payments = await Payment.findAll({
      where: {
        createdAt: { [Op.gte]: startOfDay },
        status: "completed",
      },
      include: [{ model: Order, as: "order" }],
    });

    const totalAmount = payments.reduce(
      (sum, p) => sum + Number.parseFloat(p.amount),
      0
    );
    const totalTips = payments.reduce(
      (sum, p) => sum + Number.parseFloat(p.tipAmount || 0),
      0
    );

    res.json({
      success: true,
      data: { payments, totalAmount, totalTips, count: payments.length },
    });
  })
);

// Get Payment Details
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: Order, as: "order" },
        { model: User, as: "processor" },
      ],
    });

    if (!payment) throw new AppError("Payment not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { payment } });
  })
);

// Calculate Payment Totals
router.post(
  "/calculate",
  authenticate,
  asyncHandler(async (req, res) => {
    const {
      orderId,
      discountPercentage = 0,
      serviceChargePercentage = 0,
      taxRate = 0.1,
    } = req.body;

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderLine, as: "lines" }],
    });

    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const subtotal = order.lines.reduce(
      (sum, line) => sum + Number.parseFloat(line.lineTotal),
      0
    );
    const discountAmount = subtotal * (discountPercentage / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const serviceCharge =
      subtotalAfterDiscount * (serviceChargePercentage / 100);
    const taxAmount = (subtotalAfterDiscount + serviceCharge) * taxRate;
    const grandTotal = subtotalAfterDiscount + serviceCharge + taxAmount;

    res.json({
      success: true,
      data: {
        subtotal,
        discountAmount,
        discountPercentage,
        subtotalAfterDiscount,
        serviceCharge,
        serviceChargePercentage,
        taxAmount,
        taxRate,
        grandTotal,
      },
    });
  })
);

// Process Payment
router.post(
  "/process",
  authenticate,
  authorize("cashier", "manager", "admin"),
  asyncHandler(async (req, res) => {
    const {
      orderId,
      amount,
      paymentMethod,
      tipAmount = 0,
      changeGiven = 0,
      paymentDetails = {},
    } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    if (amount <= 0) {
      throw new AppError(
        "Payment amount must be greater than 0",
        400,
        "INVALID_AMOUNT"
      );
    }

    const paymentNumber = await generatePaymentNumber();

    const payment = await Payment.create({
      orderId,
      paymentNumber,
      amount,
      paymentMethod,
      tipAmount,
      changeGiven,
      paymentDetails,
      processedBy: req.user.id,
      status: "completed",
      completedAt: new Date(),
    });

    await order.update({
      status: "paid",
      paidAmount: amount,
      paidAt: new Date(),
    });

    await AuditLog.create({
      action: "payment.processed",
      entityType: "Payment",
      entityId: payment.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { orderId, amount, paymentMethod, tipAmount },
      severity: "info",
    });

    logger.info("Payment processed", {
      paymentId: payment.id,
      orderId,
      amount,
      processedBy: req.user.id,
    });

    res.status(201).json({ success: true, data: { payment } });
  })
);

// Refund Payment
router.post(
  "/:id/refund",
  authenticate,
  authorize("manager", "admin"),
  asyncHandler(async (req, res) => {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) throw new AppError("Payment not found", 404, "NOT_FOUND");

    if (payment.status === "refunded") {
      throw new AppError("Payment already refunded", 400, "ALREADY_REFUNDED");
    }

    const { reason } = req.body;

    const oldStatus = payment.status;

    await payment.update({
      status: "refunded",
      refundReason: reason,
      refundedBy: req.user.id,
    });

    const order = await Order.findByPk(payment.orderId);
    if (order) {
      await order.update({ status: "refunded" });
    }

    await AuditLog.create({
      action: "payment.refunded",
      entityType: "Payment",
      entityId: payment.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { status: oldStatus },
      newValues: { status: "refunded", reason },
      severity: "warning",
    });

    logger.info("Payment refunded", {
      paymentId: payment.id,
      reason,
      refundedBy: req.user.id,
    });

    res.json({ success: true, data: { payment } });
  })
);

// Void Payment
router.post(
  "/:id/void",
  authenticate,
  authorize("manager", "admin"),
  asyncHandler(async (req, res) => {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) throw new AppError("Payment not found", 404, "NOT_FOUND");

    if (payment.status !== "completed") {
      throw new AppError(
        "Only completed payments can be voided",
        400,
        "INVALID_STATUS"
      );
    }

    const { reason } = req.body;

    await payment.update({
      status: "failed",
      failureReason: reason,
    });

    const order = await Order.findByPk(payment.orderId);
    if (order) {
      await order.update({ status: "open", paidAmount: 0, paidAt: null });
    }

    await AuditLog.create({
      action: "payment.voided",
      entityType: "Payment",
      entityId: payment.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { reason },
      severity: "warning",
    });

    res.json({ success: true, data: { payment } });
  })
);

// Get Payments for Order
router.get(
  "/order/:orderId",
  authenticate,
  asyncHandler(async (req, res) => {
    const payments = await Payment.findAll({
      where: { orderId: req.params.orderId },
      include: [
        { model: User, as: "processor", attributes: ["id", "username"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: { payments } });
  })
);

// Process Split Payment
router.post(
  "/split",
  authenticate,
  authorize("cashier", "manager", "admin"),
  asyncHandler(async (req, res) => {
    const { orderId, payments } = req.body;

    if (!Array.isArray(payments) || payments.length === 0) {
      throw new AppError(
        "At least one payment method required",
        400,
        "INVALID_PAYMENTS"
      );
    }

    const order = await Order.findByPk(orderId);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const totalAmount = payments.reduce(
      (sum, p) => sum + Number.parseFloat(p.amount),
      0
    );

    if (Math.abs(totalAmount - Number.parseFloat(order.grandTotal)) > 0.01) {
      throw new AppError(
        "Payment total does not match order total",
        400,
        "AMOUNT_MISMATCH"
      );
    }

    const createdPayments = [];

    for (const paymentData of payments) {
      const paymentNumber = await generatePaymentNumber();

      const payment = await Payment.create({
        orderId,
        paymentNumber,
        amount: paymentData.amount,
        paymentMethod: paymentData.method,
        tipAmount: paymentData.tipAmount || 0,
        paymentDetails: paymentData.details || {},
        processedBy: req.user.id,
        status: "completed",
        completedAt: new Date(),
      });

      createdPayments.push(payment);
    }

    await order.update({
      status: "paid",
      paidAmount: totalAmount,
      paidAt: new Date(),
    });

    await AuditLog.create({
      action: "payment.split_processed",
      entityType: "Order",
      entityId: orderId,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { paymentCount: payments.length, totalAmount },
      severity: "info",
    });

    res
      .status(201)
      .json({ success: true, data: { payments: createdPayments } });
  })
);

// Get Available Payment Methods
router.get(
  "/methods",
  authenticate,
  asyncHandler(async (req, res) => {
    const methods = [
      "cash",
      "credit_card",
      "debit_card",
      "digital_wallet",
      "voucher",
    ];

    res.json({ success: true, data: { methods } });
  })
);

export default router;
