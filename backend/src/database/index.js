const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI || "";

const connectWithRetry = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.error("MongoDB connection unsuccessful, reconnecting...", err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

module.exports = mongoose.connection;
