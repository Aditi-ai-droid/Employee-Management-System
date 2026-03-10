import mongoose from "mongoose";
import dotenv from "dotenv";
import Employee from "./models/Employee.js";
import Attendance from "./models/Attendance.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // Clear old data
    await Employee.deleteMany({});
    await Attendance.deleteMany({});

    console.log("🗑 Old data removed");

    // Fake Employees
    const employees = await Employee.insertMany([
      { name: "Aditi", position: "Manager", salary: 50000 },
      { name: "Vikas", position: "Developer", salary: 35000 },
      { name: "Priya", position: "Designer", salary: 30000 },
      { name: "Rahul", position: "Accountant", salary: 26000 },
      { name: "Sneha", position: "HR", salary: 28000 },
    ]);

    console.log("👥 Employees added");

    // Fake Attendance
    const attendance = [];

    employees.forEach((emp) => {
      attendance.push(
        { employeeId: emp._id, date: "2025-01-01", status: "Present" },
        { employeeId: emp._id, date: "2025-01-02", status: "Present" },
        { employeeId: emp._id, date: "2025-01-03", status: "Absent" }
      );
    });

    await Attendance.insertMany(attendance);

    console.log("🕘 Attendance records added");

    console.log("✅ Seeding Complete");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
