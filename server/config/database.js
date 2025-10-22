import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath =
  process.env.DB_PATH || path.join(__dirname, "../../data/restaurant.db");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: (msg) => logger.debug(msg),
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});
