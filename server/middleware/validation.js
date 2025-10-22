import Joi from "joi"
import { AppError } from "./errorHandler.js"

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }))
    throw new AppError("Validation error", 400, "VALIDATION_ERROR", details)
  }

  req.validatedData = value
  next()
}

export const schemas = {
  // Authentication
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("admin", "manager", "server", "kitchen_staff", "cashier"),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  // Tables
  createTable: Joi.object({
    tableNumber: Joi.number().min(1).max(999).required(),
    tableName: Joi.string().max(50),
    capacity: Joi.number().min(1).max(20).required(),
    location: Joi.string().valid("main_hall", "patio", "private_room", "bar_area", "terrace"),
    minOrderAmount: Joi.number().min(0),
    notes: Joi.string(),
  }),

  // Menu Categories
  createMenuCategory: Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string(),
    type: Joi.string()
      .valid("breakfast", "lunch", "dinner", "buffet_lunch", "buffet_dinner", "all_day", "beverages")
      .required(),
    displayOrder: Joi.number().default(0),
    startTime: Joi.string().pattern(/^\d{2}:\d{2}$/),
    endTime: Joi.string().pattern(/^\d{2}:\d{2}$/),
    daysAvailable: Joi.array().items(
      Joi.string().valid("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"),
    ),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    imageUrl: Joi.string().uri(),
  }),

  // Menu Items
  createMenuItem: Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string(),
    shortDescription: Joi.string().max(100),
    price: Joi.number().min(0.01).required(),
    costPrice: Joi.number().min(0),
    imageUrl: Joi.string().uri(),
    categoryId: Joi.string().uuid().required(),
    subcategories: Joi.array().items(Joi.string()),
    preparationTime: Joi.number().min(0).max(480),
    isAvailable: Joi.boolean().default(true),
    isPopular: Joi.boolean().default(false),
    isRecommended: Joi.boolean().default(false),
    ingredients: Joi.array().items(Joi.string()),
    allergens: Joi.array().items(Joi.string().valid("nuts", "dairy", "gluten", "seafood", "soy", "eggs", "shellfish")),
    nutritionalInfo: Joi.object({
      calories: Joi.number(),
      protein: Joi.number(),
      carbs: Joi.number(),
      fat: Joi.number(),
    }),
    spiceLevel: Joi.string().valid("mild", "medium", "hot", "very_hot"),
    maxDailyQuantity: Joi.number().min(1),
    customizationOptions: Joi.object(),
    tags: Joi.array().items(Joi.string()),
  }),

  // Orders
  createOrder: Joi.object({
    tableId: Joi.string().uuid().required(),
    customerCount: Joi.number().min(1).max(50),
    type: Joi.string().valid("dine_in", "takeaway", "delivery").default("dine_in"),
  }),

  addOrderItem: Joi.object({
    menuItemId: Joi.string().uuid().required(),
    quantity: Joi.number().min(1).max(99).required(),
    specialInstructions: Joi.string(),
    customization: Joi.object(),
  }),
}
