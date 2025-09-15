const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
