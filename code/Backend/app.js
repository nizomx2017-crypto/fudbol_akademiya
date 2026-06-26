const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/Studentroutes");
const courseRoutes = require("./routes/CourseRoutes");
const teacherRoutes = require("./routes/TeacherRoutes");
const groupRoutes = require("./routes/GroupRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const roomRoutes = require("./routes/RoomRoutes");
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

app.use("/api", requireAuthorization);

app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;
