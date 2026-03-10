import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

const deptField = (doc) => ("department" in doc ? "department" : "position");

export const getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const sum = await Employee.aggregate([
      { $group: { _id: null, total: { $sum: { $toDouble: "$salary" } } } },
    ]);
    const totalSalary = sum[0]?.total || 0;

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const att = await Attendance.aggregate([
      { $match: { date: { $gte: since } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const present = att.find((x) => x._id === "Present")?.count || 0;
    const absent = att.find((x) => x._id === "Absent")?.count || 0;

    const denom = present + absent;
    const attendanceRate = denom > 0 ? Math.round((present / denom) * 100) : 0;

    const one = await Employee.findOne().lean();
    const field = one ? deptField(one) : "position";
    const departments = await Employee.distinct(field);

    res.json({
      totalEmployees,
      totalSalary,
      attendanceRate,
      departments: departments.length,
    });
  } catch (err) {
    console.error("Dashboard Summary Error:", err);
    res.status(500).json({
      message: "Failed to fetch summary",
      error: err.message,
    });
  }
};
