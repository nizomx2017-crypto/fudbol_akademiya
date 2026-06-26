const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const studentRoutes = require("./routes/Studentroutes");
const courseRoutes = require("./routes/CourseRoutes");
const teacherRoutes = require("./routes/TeacherRoutes");
const groupRoutes = require("./routes/GroupRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const roomRoutes = require("./routes/RoomRoutes");
require("./models/associations");

app.use(cors());
app.use(express.json());
app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);


app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rooms", roomRoutes);


app.get("/", (req,res)=>{
    res.json({
        message:"Backend ishlayapti"
    });
});


const PORT = 5000;


app.listen(PORT, ()=>{
    console.log(`Server ${PORT} portda ishladi`);
});

const db = require("./config/db");

db.sync({ force: true })
  .then(() => {
    console.log("Database jadvali yaratildi");
  })
  .catch((err) => {
    console.log(err);
  });