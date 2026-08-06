const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const studentRoutes = require("./routes/Studentroutes");
const courseRoutes = require("./routes/CourseRoutes");
const teacherRoutes = require("./routes/TeacherRoutes");
const groupRoutes = require("./routes/GroupRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const roomRoutes = require("./routes/RoomRoutes");
const authRoutes = require("./routes/AuthRoutes");
const requireAuthorization = require("./middleware/auth");
const { apiRateLimiter } = require("./middleware/rateLimit");
require("./models/associations");
const { notFound, errorHandler } = require("./shared/errors");
const requestId = require("./shared/request-id");

const app = express();

app.disable("x-powered-by");
app.use(requestId);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : false, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Backend ishlayapti",
  });
});
app.use("/ops", require("./modules/ops/router"));
app.use("/telegram", require("./modules/tgbot/router"));
app.post("/webhooks/payment", ...require("./modules/payment/router").webhook);
app.get("/openapi.json", (req, res) => res.json(require("./openapi")));

app.use("/auth", authRoutes);
app.use("/api", apiRateLimiter);
app.use("/api", requireAuthorization);

app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", require("./modules/user/router"));
app.use("/api/payments-v2", require("./modules/payment/router").router);
app.use("/api/billing", require("./modules/billing/router"));
app.use("/api/storage", require("./modules/storage/router"));
app.use("/api/chat", require("./modules/chat/router"));
app.use("/api/notifications", require("./modules/notification/router"));
app.use("/api/integrations", require("./modules/integration/router"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
