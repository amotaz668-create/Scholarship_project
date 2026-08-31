const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

const MONGODBURL = process.env.MONGODBURL;

if (!MONGODBURL) {
  throw new Error("MONGODBURL is not configured");
}

mongoose
  .connect(MONGODBURL)

  .then(() => {
    console.log("Connected to MongoDB successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })

  .catch((error) => {
    console.error("Database connection error:", error.message);

    process.exit(1);
  });
