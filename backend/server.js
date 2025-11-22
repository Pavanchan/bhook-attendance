// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportRoutes = require('./routes/reportRoutes');





const app = express();

// ✅ CORS – allow frontend on port 5173
app.use(
  cors({
    origin: ["http://localhost:5173"], // add more origins in this array if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "10mb" }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);      // protected with auth inside file
app.use('/api/attendance', attendanceRoutes);   // protected with auth inside file
app.use('/api/reports', reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
