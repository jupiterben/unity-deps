import {
    Sequelize,
    DataTypes
} from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "dev.db", // Replace with the path to your SQLite database file
});
sequelize.query("PRAGMA journal_mode=WAL;");
