import "module-alias/register";
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
