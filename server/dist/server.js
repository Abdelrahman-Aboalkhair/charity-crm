"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = require("module-alias");
const path_1 = __importDefault(require("path"));
// Dynamically set module alias based on NODE_ENV
const isProduction = process.env.NODE_ENV === "production";
const projectRoot = path_1.default.resolve(__dirname, ".."); // Move up from src to project root
const aliasPath = path_1.default.join(projectRoot, isProduction ? "dist" : "src");
console.log(`${isProduction ? "Production" : "Development"} Module alias @ set to:`, aliasPath); // Debug log
(0, module_alias_1.addAlias)("@", aliasPath);
const app_1 = __importDefault(require("./app"));
const database_config_1 = require("./infra/database/database.config");
const PORT = process.env.PORT || 5000;
(0, database_config_1.connectDB)();
const server = app_1.default
    .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})
    .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        server.listen(0);
    }
    else {
        console.error("Server error:", err);
    }
});
