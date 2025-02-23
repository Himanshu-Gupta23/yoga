// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/about", require("./routes/aboutRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/user", require("./routes/User"));
app.use("/api/images",require("./routes/imageRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
