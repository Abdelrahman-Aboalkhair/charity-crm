import { addAlias } from "module-alias";
import path from "path";

// Dynamically set module alias based on NODE_ENV
const isProduction = process.env.NODE_ENV === "production";
const projectRoot = path.resolve(__dirname, ".."); // Move up from src to project root
const aliasPath = path.join(projectRoot, isProduction ? "dist" : "src");

console.log(
  `${isProduction ? "Production" : "Development"} Module alias @ set to:`,
  aliasPath
); // Debug log
addAlias("@", aliasPath);
import app from "./app";
import { connectDB } from "./infra/database/database.config";

const PORT = process.env.PORT || 5000;

connectDB();

const server = app
  .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Trying another port...`);
      server.listen(0);
    } else {
      console.error("Server error:", err);
    }
  });
