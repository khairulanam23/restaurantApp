import express from "express";
import { MenuCategory, MenuItem, AuditLog } from "../models/index.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";
import { Op } from "sequelize";

const router = express.Router();

// ===== CATEGORIES =====

// Get All Categories
router.get(
  "/categories",
  authenticate,
  asyncHandler(async (req, res) => {
    const categories = await MenuCategory.findAll({
      where: { isActive: true },
      order: [["displayOrder", "ASC"]],
    });

    res.json({ success: true, data: { categories } });
  })
);

// Get Active Categories (time-based availability)
router.get(
  "/categories/active",
  authenticate,
  asyncHandler(async (req, res) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][now.getDay()];

    const categories = await MenuCategory.findAll({
      where: { isActive: true },
    });

    const activeCategories = categories.filter((cat) => {
      if (!cat.startTime || !cat.endTime) return true;
      if (cat.daysAvailable && !cat.daysAvailable.includes(dayName))
        return false;
      return currentTime >= cat.startTime && currentTime <= cat.endTime;
    });

    res.json({ success: true, data: { categories: activeCategories } });
  })
);

// Get Category Details
router.get(
  "/categories/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.findByPk(req.params.id);
    if (!category) throw new AppError("Category not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { category } });
  })
);

// Create Category
router.post(
  "/categories",
  authenticate,
  authorize("admin", "manager"),
  validate(schemas.createMenuCategory),
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.create(req.validatedData);

    await AuditLog.create({
      action: "menu_category.created",
      entityType: "MenuCategory",
      entityId: category.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: req.validatedData,
      severity: "info",
    });

    logger.info("Menu category created", {
      categoryId: category.id,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: { category } });
  })
);

// Update Category
router.put(
  "/categories/:id",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.findByPk(req.params.id);
    if (!category) throw new AppError("Category not found", 404, "NOT_FOUND");

    const oldValues = { ...category.toJSON() };

    await category.update(req.body);

    await AuditLog.create({
      action: "menu_category.updated",
      entityType: "MenuCategory",
      entityId: category.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues,
      newValues: req.body,
      severity: "info",
    });

    logger.info("Menu category updated", {
      categoryId: category.id,
      updatedBy: req.user.id,
    });

    res.json({ success: true, data: { category } });
  })
);

// Delete Category
router.delete(
  "/categories/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const category = await MenuCategory.findByPk(req.params.id);
    if (!category) throw new AppError("Category not found", 404, "NOT_FOUND");

    // Check if category has items
    const itemCount = await MenuItem.count({
      where: { categoryId: req.params.id },
    });
    if (itemCount > 0) {
      throw new AppError(
        "Cannot delete category with items",
        400,
        "CATEGORY_HAS_ITEMS"
      );
    }

    await category.destroy();

    await AuditLog.create({
      action: "menu_category.deleted",
      entityType: "MenuCategory",
      entityId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "warning",
    });

    logger.info("Menu category deleted", {
      categoryId: req.params.id,
      deletedBy: req.user.id,
    });

    res.json({ success: true, message: "Category deleted successfully" });
  })
);

// ===== MENU ITEMS =====

// Get All Items with Filters
router.get(
  "/items",
  authenticate,
  asyncHandler(async (req, res) => {
    const {
      categoryId,
      isPopular,
      isRecommended,
      page = 1,
      limit = 20,
    } = req.query;
    const where = { isAvailable: true };

    if (categoryId) where.categoryId = categoryId;
    if (isPopular === "true") where.isPopular = true;
    if (isRecommended === "true") where.isRecommended = true;

    const items = await MenuItem.findAll({
      where,
      include: [{ model: MenuCategory, as: "category" }],
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      order: [["name", "ASC"]],
    });

    const total = await MenuItem.count({ where });

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Get Available Items Only
router.get(
  "/items/available",
  authenticate,
  asyncHandler(async (req, res) => {
    const items = await MenuItem.findAll({
      where: { isAvailable: true },
      include: [{ model: MenuCategory, as: "category" }],
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: { items } });
  })
);

// Get Popular Items
router.get(
  "/items/popular",
  authenticate,
  asyncHandler(async (req, res) => {
    const items = await MenuItem.findAll({
      where: { isPopular: true, isAvailable: true },
      limit: 10,
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: { items } });
  })
);

// Search Items by Name/Description
router.get(
  "/items/search",
  authenticate,
  asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      throw new AppError(
        "Search query must be at least 2 characters",
        400,
        "INVALID_SEARCH"
      );
    }

    const items = await MenuItem.findAll({
      where: {
        isAvailable: true,
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { shortDescription: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [{ model: MenuCategory, as: "category" }],
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
    });

    const total = await MenuItem.count({
      where: {
        isAvailable: true,
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { shortDescription: { [Op.like]: `%${q}%` } },
        ],
      },
    });

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Get Item Details
router.get(
  "/items/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [{ model: MenuCategory, as: "category" }],
    });

    if (!item) throw new AppError("Menu item not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { item } });
  })
);

// Get Similar Items
router.get(
  "/items/:id/similar",
  authenticate,
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) throw new AppError("Menu item not found", 404, "NOT_FOUND");

    const similarItems = await MenuItem.findAll({
      where: {
        categoryId: item.categoryId,
        id: { [Op.ne]: req.params.id },
        isAvailable: true,
      },
      limit: 5,
    });

    res.json({ success: true, data: { items: similarItems } });
  })
);

// Create Item
router.post(
  "/items",
  authenticate,
  authorize("admin", "manager"),
  validate(schemas.createMenuItem),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.validatedData;

    const category = await MenuCategory.findByPk(categoryId);
    if (!category) throw new AppError("Category not found", 404, "NOT_FOUND");

    const item = await MenuItem.create(req.validatedData);

    await AuditLog.create({
      action: "menu_item.created",
      entityType: "MenuItem",
      entityId: item.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: req.validatedData,
      severity: "info",
    });

    logger.info("Menu item created", {
      itemId: item.id,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: { item } });
  })
);

// Update Item
router.put(
  "/items/:id",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) throw new AppError("Menu item not found", 404, "NOT_FOUND");

    const oldValues = { ...item.toJSON() };

    await item.update(req.body);

    await AuditLog.create({
      action: "menu_item.updated",
      entityType: "MenuItem",
      entityId: item.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues,
      newValues: req.body,
      severity: "info",
    });

    logger.info("Menu item updated", {
      itemId: item.id,
      updatedBy: req.user.id,
    });

    res.json({ success: true, data: { item } });
  })
);

// Toggle Item Availability
router.put(
  "/items/:id/availability",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) throw new AppError("Menu item not found", 404, "NOT_FOUND");

    const { isAvailable } = req.body;
    const oldValue = item.isAvailable;

    await item.update({ isAvailable });

    await AuditLog.create({
      action: "menu_item.availability_toggled",
      entityType: "MenuItem",
      entityId: item.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { isAvailable: oldValue },
      newValues: { isAvailable },
      severity: "info",
    });

    logger.info("Menu item availability updated", {
      itemId: item.id,
      isAvailable,
      updatedBy: req.user.id,
    });

    res.json({ success: true, data: { item } });
  })
);

// Bulk Update Items
router.post(
  "/items/bulk-update",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { itemIds, updates } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw new AppError("Item IDs required", 400, "INVALID_INPUT");
    }

    await MenuItem.update(updates, { where: { id: { [Op.in]: itemIds } } });

    await AuditLog.create({
      action: "menu_item.bulk_updated",
      entityType: "MenuItem",
      entityId: itemIds.join(","),
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { count: itemIds.length, updates },
      severity: "info",
    });

    res.json({ success: true, message: `${itemIds.length} items updated` });
  })
);

// Delete Item
router.delete(
  "/items/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) throw new AppError("Menu item not found", 404, "NOT_FOUND");

    await item.destroy();

    await AuditLog.create({
      action: "menu_item.deleted",
      entityType: "MenuItem",
      entityId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "warning",
    });

    logger.info("Menu item deleted", {
      itemId: req.params.id,
      deletedBy: req.user.id,
    });

    res.json({ success: true, message: "Menu item deleted successfully" });
  })
);

export default router;
