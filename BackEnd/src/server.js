const mongoose = require("mongoose");
const app = require("./app");
const redisClient = require("./config/redis"); // already connected

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

redisClient.on("ready", () => {
    console.log("Redis connected");
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
