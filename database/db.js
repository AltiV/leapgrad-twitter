const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoURL = process.env.MONGODB_URL || "";

// Connect to MongoDB
mongoose
  .connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  });

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
