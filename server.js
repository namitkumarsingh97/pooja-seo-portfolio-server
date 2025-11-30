import app from "./index.js";
import { connectDB } from "./src/config/db.js";

const port = process.env.PORT || 5001;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start API server", error);
    process.exit(1);
  }
};

start();

