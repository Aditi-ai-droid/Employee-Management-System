// ✅ Reports.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, empRes] = await Promise.all([
          fetch("http://localhost:5000/api/attendance"),
          fetch("http://localhost:5000/api/employees"),
        ]);

        if (!attRes.ok || !empRes.ok) {
          throw new Error("Server not responding");
        }

        const attData = await attRes.json();
        const empData = await empRes.json();

        setAttendance(Array.isArray(attData) ? attData : []);
        setEmployees(Array.isArray(empData) ? empData : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reports. Please check backend connection.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Download PDF
  const handleDownloadPDF = () => {
    const report = document.querySelector(".report-page");

    html2canvas(report, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Employee_Report.pdf");
    });
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) return <h2 className="loading-text">Loading Reports...</h2>;
  if (error) return <h2 className="error-text">{error}</h2>;

  // ✅ Attendance Calculations
  const totalPresent = attendance.filter((a) => a.status === "Present").length;
  const totalAbsent = attendance.filter((a) => a.status === "Absent").length;
  const totalLeave = attendance.filter((a) => a.status === "Leave").length;

  const total = totalPresent + totalAbsent + totalLeave;
  const calc = (v) => (total ? ((v / total) * 100).toFixed(0) : 0);

  const chartData = [
    { name: "Present", value: Number(calc(totalPresent)) },
    { name: "Absent", value: Number(calc(totalAbsent)) },
    { name: "Leave", value: Number(calc(totalLeave)) },
  ];

  const COLORS = ["#16a34a", "#ef4444", "#f59e0b"];

  return (
    <div className="report-page">

      {/* ✅ HEADER */}
      <div className="page-header">
        <img src="image/logo.png" alt="" className="header-logo" />
        <h1>📊 Reports & Analytics</h1>
        <p>Track employee attendance with beautiful analytics & insights.</p>
      </div>

      <button className="pdf-btn" onClick={handleDownloadPDF}>
        📄 Download Report
      </button>

      {/* ✅ STATS */}
      <div className="summary-cards">
        <div className="card total">
          <h2>{employees.length}</h2>
          <p>Total Employees</p>
        </div>
        <div className="card present">
          <h2>{totalPresent}</h2>
          <p>Present</p>
        </div>
        <div className="card absent">
          <h2>{totalAbsent}</h2>
          <p>Absent</p>
        </div>
        <div className="card leave">
          <h2>{totalLeave}</h2>
          <p>On Leave</p>
        </div>
      </div>

      {/* ✅ INLINE CHARTS */}
      <div className="chart-row">

        {/* ✅ BAR CHART */}
        <div className="chart-card small">
          <h2>Attendance % Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ PIE CHART */}
        <div className="chart-card small">
          <h2>Attendance Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <button className="back-btn" onClick={handleBackToDashboard}>
        🏠 Dashboard
      </button>

      <p className="footer-note">
        ✅ Reports auto-update when new attendance is added.
      </p>
    </div>
  );
}
