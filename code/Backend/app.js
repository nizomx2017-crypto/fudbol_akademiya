const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentroutes");
const courseRoutes = require("./routes/courseroutes");
const teacherRoutes = require("./routes/teacherroutes");
const groupRoutes = require("./routes/grouproutes");
const paymentRoutes = require("./routes/paymentroutes");
const roomRoutes = require("./routes/roomroutes");
const authRoutes = require("./routes/authroutes");
const requireAuthorization = require("./middleware/auth");
require("./models/associations");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend ishlayapti",
  });
});

app.use("/auth", authRoutes);
app.use("/api", requireAuthorization);

app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;
