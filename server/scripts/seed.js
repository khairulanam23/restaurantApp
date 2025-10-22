import {
  User,
  Table,
  MenuCategory,
  MenuItem,
  Order,
  OrderLine,
  Payment,
} from "../models/index.js";
import { logger } from "../utils/logger.js";

const seedDatabase = async () => {
  try {
    logger.info("Starting database seeding...");

    // Create Admin User
    const adminUser = await User.create({
      username: "admin",
      email: "admin@restaurant.com",
      password: "Admin@123456",
      role: "admin",
    });

    // Create Manager
    const manager = await User.create({
      username: "manager",
      email: "manager@restaurant.com",
      password: "Manager@123456",
      role: "manager",
    });

    // Create Servers
    const server1 = await User.create({
      username: "server1",
      email: "server1@restaurant.com",
      password: "Server@123456",
      role: "server",
    });

    const server2 = await User.create({
      username: "server2",
      email: "server2@restaurant.com",
      password: "Server@123456",
      role: "server",
    });

    // Create Kitchen Staff
    const kitchenStaff = await User.create({
      username: "kitchen",
      email: "kitchen@restaurant.com",
      password: "Kitchen@123456",
      role: "kitchen_staff",
    });

    // Create Cashier
    const cashier = await User.create({
      username: "cashier",
      email: "cashier@restaurant.com",
      password: "Cashier@123456",
      role: "cashier",
    });

    logger.info("Users created");

    // Create Sample Tables
    const tables = [];
    for (let i = 1; i <= 15; i++) {
      const table = await Table.create({
        tableNumber: i,
        tableName: `Table ${i}`,
        capacity: i <= 5 ? 2 : i <= 10 ? 4 : 6,
        location:
          i <= 5
            ? "main_hall"
            : i <= 10
            ? "patio"
            : i <= 12
            ? "private_room"
            : i <= 14
            ? "bar_area"
            : "terrace",
        minOrderAmount: i > 12 ? 50 : 0,
        notes:
          i === 1 ? "Window view" : i === 5 ? "High chair available" : null,
      });
      tables.push(table);
    }
    logger.info("Sample tables created");

    // Create Menu Categories with time-based availability
    const categories = [];
    const categoryData = [
      {
        name: "Breakfast",
        type: "breakfast",
        startTime: "06:00",
        endTime: "11:00",
        daysAvailable: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        displayOrder: 1,
      },
      {
        name: "Lunch",
        type: "lunch",
        startTime: "11:00",
        endTime: "16:00",
        daysAvailable: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        displayOrder: 2,
      },
      {
        name: "Dinner",
        type: "dinner",
        startTime: "16:00",
        endTime: "23:00",
        daysAvailable: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        displayOrder: 3,
      },
      {
        name: "Beverages",
        type: "beverages",
        displayOrder: 4,
      },
      {
        name: "Desserts",
        type: "all_day",
        displayOrder: 5,
      },
    ];

    for (const data of categoryData) {
      const category = await MenuCategory.create(data);
      categories.push(category);
    }
    logger.info("Menu categories created");

    // Create Sample Menu Items with comprehensive data
    const itemsData = [
      {
        name: "Pancakes",
        description: "Fluffy pancakes with maple syrup",
        shortDescription: "Fluffy pancakes",
        price: 8.99,
        costPrice: 2.5,
        categoryId: categories[0].id,
        preparationTime: 10,
        isAvailable: true,
        isPopular: true,
        allergens: ["gluten", "dairy", "eggs"],
        spiceLevel: "mild",
        ingredients: ["flour", "eggs", "milk", "butter", "maple syrup"],
        nutritionalInfo: { calories: 450, protein: 12, carbs: 65, fat: 15 },
      },
      {
        name: "Eggs Benedict",
        description: "Poached eggs with hollandaise sauce",
        shortDescription: "Poached eggs",
        price: 12.99,
        costPrice: 4.0,
        categoryId: categories[0].id,
        preparationTime: 15,
        isAvailable: true,
        allergens: ["dairy", "eggs"],
        spiceLevel: "mild",
        ingredients: ["eggs", "english muffin", "ham", "hollandaise sauce"],
        nutritionalInfo: { calories: 520, protein: 18, carbs: 35, fat: 32 },
      },
      {
        name: "Burger",
        description: "Juicy beef burger with fresh toppings",
        shortDescription: "Beef burger",
        price: 14.99,
        costPrice: 5.0,
        categoryId: categories[1].id,
        preparationTime: 20,
        isAvailable: true,
        isPopular: true,
        allergens: ["gluten", "dairy"],
        spiceLevel: "mild",
        ingredients: [
          "beef patty",
          "bun",
          "lettuce",
          "tomato",
          "cheese",
          "pickles",
        ],
        nutritionalInfo: { calories: 650, protein: 35, carbs: 45, fat: 28 },
        customizationOptions: {
          extra_cheese: { price: 1.5 },
          bacon: { price: 2.0 },
          no_onions: { price: 0 },
        },
      },
      {
        name: "Caesar Salad",
        description: "Fresh romaine with parmesan and croutons",
        shortDescription: "Caesar salad",
        price: 10.99,
        costPrice: 3.0,
        categoryId: categories[1].id,
        preparationTime: 5,
        isAvailable: true,
        allergens: ["dairy", "gluten"],
        spiceLevel: "mild",
        ingredients: [
          "romaine lettuce",
          "parmesan",
          "croutons",
          "caesar dressing",
        ],
        nutritionalInfo: { calories: 320, protein: 12, carbs: 25, fat: 18 },
      },
      {
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with lemon butter",
        shortDescription: "Grilled salmon",
        price: 24.99,
        costPrice: 10.0,
        categoryId: categories[2].id,
        preparationTime: 25,
        isAvailable: true,
        isRecommended: true,
        allergens: ["seafood"],
        spiceLevel: "mild",
        ingredients: ["salmon fillet", "lemon", "butter", "herbs"],
        nutritionalInfo: { calories: 480, protein: 42, carbs: 0, fat: 32 },
      },
      {
        name: "Ribeye Steak",
        description: "Premium 12oz ribeye with garlic butter",
        shortDescription: "Ribeye steak",
        price: 28.99,
        costPrice: 12.0,
        categoryId: categories[2].id,
        preparationTime: 30,
        isAvailable: true,
        isRecommended: true,
        allergens: [],
        spiceLevel: "medium",
        ingredients: ["ribeye steak", "garlic", "butter", "herbs"],
        nutritionalInfo: { calories: 650, protein: 55, carbs: 0, fat: 48 },
      },
      {
        name: "Espresso",
        description: "Rich and bold espresso shot",
        shortDescription: "Espresso",
        price: 3.99,
        costPrice: 0.5,
        categoryId: categories[3].id,
        preparationTime: 2,
        isAvailable: true,
        allergens: [],
        spiceLevel: "mild",
        ingredients: ["espresso beans"],
        nutritionalInfo: { calories: 5, protein: 0, carbs: 0, fat: 0 },
      },
      {
        name: "Cappuccino",
        description: "Espresso with steamed milk and foam",
        shortDescription: "Cappuccino",
        price: 4.99,
        costPrice: 1.0,
        categoryId: categories[3].id,
        preparationTime: 3,
        isAvailable: true,
        allergens: ["dairy"],
        spiceLevel: "mild",
        ingredients: ["espresso", "steamed milk", "foam"],
        nutritionalInfo: { calories: 120, protein: 8, carbs: 10, fat: 4 },
      },
      {
        name: "Iced Tea",
        description: "Refreshing iced tea with lemon",
        shortDescription: "Iced tea",
        price: 2.99,
        costPrice: 0.3,
        categoryId: categories[3].id,
        preparationTime: 1,
        isAvailable: true,
        allergens: [],
        spiceLevel: "mild",
        ingredients: ["tea", "ice", "lemon"],
        nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake with frosting",
        shortDescription: "Chocolate cake",
        price: 7.99,
        costPrice: 2.0,
        categoryId: categories[4].id,
        preparationTime: 2,
        isAvailable: true,
        isPopular: true,
        allergens: ["gluten", "dairy", "eggs"],
        spiceLevel: "mild",
        ingredients: ["chocolate", "flour", "eggs", "butter", "frosting"],
        nutritionalInfo: { calories: 420, protein: 5, carbs: 55, fat: 20 },
      },
      {
        name: "Cheesecake",
        description: "New York style cheesecake",
        shortDescription: "Cheesecake",
        price: 8.99,
        costPrice: 2.5,
        categoryId: categories[4].id,
        preparationTime: 2,
        isAvailable: true,
        allergens: ["dairy", "gluten", "eggs"],
        spiceLevel: "mild",
        ingredients: ["cream cheese", "graham cracker crust", "eggs", "sugar"],
        nutritionalInfo: { calories: 480, protein: 8, carbs: 45, fat: 28 },
      },
    ];

    const menuItems = [];
    for (const data of itemsData) {
      const item = await MenuItem.create(data);
      menuItems.push(item);
    }
    logger.info("Sample menu items created");

    // Create Sample Orders
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Order 1: Completed order
    const order1 = await Order.create({
      orderNumber: `ORD-${now
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-001`,
      tableId: tables[0].id,
      customerCount: 2,
      type: "dine_in",
      serverId: server1.id,
      status: "paid",
      priority: "normal",
      subtotal: 25.98,
      taxAmount: 2.6,
      grandTotal: 28.58,
      taxRate: 0.1,
      paidAmount: 28.58,
      paidAt: new Date(now.getTime() - 3600000),
      servedAt: new Date(now.getTime() - 1800000),
      createdAt: new Date(now.getTime() - 7200000),
    });

    await OrderLine.create({
      orderId: order1.id,
      menuItemId: menuItems[2].id, // Burger
      quantity: 2,
      unitPrice: 14.99,
      lineTotal: 29.98,
      status: "served",
      servedAt: new Date(now.getTime() - 1800000),
    });

    // Order 2: Active order
    const order2 = await Order.create({
      orderNumber: `ORD-${now
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-002`,
      tableId: tables[1].id,
      customerCount: 4,
      type: "dine_in",
      serverId: server2.id,
      status: "in_kitchen",
      priority: "normal",
      subtotal: 49.98,
      taxAmount: 5.0,
      grandTotal: 54.98,
      taxRate: 0.1,
      createdAt: new Date(now.getTime() - 1800000),
    });

    await OrderLine.create({
      orderId: order2.id,
      menuItemId: menuItems[4].id, // Salmon
      quantity: 2,
      unitPrice: 24.99,
      lineTotal: 49.98,
      status: "preparing",
      startedAt: new Date(now.getTime() - 1200000),
      preparedBy: kitchenStaff.id,
    });

    logger.info("Sample orders created");

    // Create Sample Payments
    await Payment.create({
      orderId: order1.id,
      paymentNumber: `PAY-${now
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-001`,
      amount: 28.58,
      paymentMethod: "credit_card",
      tipAmount: 5.0,
      changeGiven: 0,
      processedBy: cashier.id,
      status: "completed",
      completedAt: new Date(now.getTime() - 3600000),
    });

    logger.info("Sample payments created");

    logger.info("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Database seeding failed", error);
    process.exit(1);
  }
};

seedDatabase();