// ✅ EmployeeDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard.css";

export default function EmployeeDashboard() {
  const [summary, setSummary] = useState(null);

  // ❌ Removed date states — NO DATE REQUIRED
  // const [startDate, setStartDate] = useState("2020-08-26");
  // const [endDate, setEndDate] = useState("2020-09-19");

  // ✅ Fetch summary
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.log("❌ Dashboard API Error:", err));
  }, []);

  // ✅ Download Report – NO DATE PARAM
  const handleDownload = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/report",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log("❌ Report Download Error:", err);
    }
  };

  if (!summary) {
    return (
      <h2 className="loading" style={{ textAlign: "center", marginTop: "40px" }}>
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <div className="dashboard full-stretch">
      <div className="layout">

        {/* ✅ SIDEBAR */}
        <aside className="sidebar fixed-left">
          <div className="brand">
            <img src="image/logo.png" alt="logo" />
          </div>

          <div className="profile">
            <img
              className="profile-img"
              src="image/avatar.jpg"
              alt="avatar"
            />
            <div>
              <div className="profile-name">Katherine B.</div>

            </div>
          </div>

          <div className="nav">
            <div className="nav-label">MAIN</div>

           <Link to="/dashboard" className="nav-item">
      🏠 Dashboard
    </Link>

    <Link to="/attendance" className="nav-item">
      🕒 Attendance
    </Link>

    <Link to="/employeeList" className="nav-item">
      👥 Employee List
    </Link>

    <Link to="/addEmployee" className="nav-item">
      ➕ Add Employee
    </Link>

    <Link to="/reports" className="nav-item">
      📊 Reports
    </Link>

    <div className="nav-label">OTHER</div>

    <Link to="/signup" className="nav-item">
      🚪 Logout
    </Link>

          </div>
        </aside>

        {/* ✅ DARK MODE */}
        <button
          className="theme-toggle"
          onClick={() => document.body.classList.toggle("dark")}
        >
          🌓
        </button>

        {/* ✅ MAIN CONTENT */}
        <main className="main expanded">
          <div className="topbar">
            <div className="breadcrumb">HOME / EMPLOYEE / MANAGEMENT</div>

            <div className="right-controls">
              {/* ✅ Removed date inputs */}
              <button className="button-primary" onClick={handleDownload}>
                Download Report
              </button>
            </div>
          </div>

          <h2 className="main-heading">Employee Dashboard</h2>

          {/* ✅ STAT CARDS */}
          <div className="stats-grid enhanced">
            <div className="stat-box premium">
              <p className="stat-title">TOTAL EMPLOYEES</p>
              <h3 className="stat-value">{summary.totalEmployees}</h3>
            </div>

            <div className="stat-box premium">
              <p className="stat-title">ATTENDANCE RATE</p>
              <h3 className="stat-value">{summary.attendanceRate}%</h3>
            </div>

            <div className="stat-box premium">
              <p className="stat-title">DEPARTMENTS</p>
              <h3 className="stat-value">{summary.departments}</h3>
            </div>
          </div>

          {/* ✅ MIDDLE SECTION */}
          <div className="section-grid compact">

            {/* ✅ WORKFORCE */}
            <div className="sales-card premium-shadow">
              <div className="sales-header">
                <div>
                  <p className="box-title">WORKFORCE OVERVIEW</p>
                  <p className="box-sub">Monthly employee activity</p>
                </div>
                <select className="month-select">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>

              <div className="bar-wrapper improved-bars">
                {[40,60,50,90,70,85,95,75,65,90,110,95].map((h, i) => (
                  <div key={i} className="bar-col">
                    <div className="bars">
                      <div className="bar1" style={{ height: h }}></div>
                      <div className="bar2" style={{ height: h - 10 }}></div>
                      <div className="bar3" style={{ height: Math.max(25, h - 35) }}></div>
                    </div>
                    <p className="bar-month">{"JFMAMJJASOND"[i]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ DONUT */}
            <div className="donut-card premium-shadow">
              <p className="box-title">DEPARTMENT RATIO</p>
              <p className="box-sub">Distribution by department</p>

              <div className="donut-wrap">
                <div
                  className="donut upgraded-ring"
                  style={{
                    background:
                      "conic-gradient(#6366F1 0deg 135deg, #23a723ff 135deg 290deg, #cb2828ff 290deg 360deg)"
                  }}
                ></div>

                <div className="legend">
                  <p><span className="dot dot1"></span>Tech</p>
                  <p><span className="dot dot2"></span>Sales</p>
                  <p><span className="dot dot3"></span>Other</p>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ BOTTOM SECTION */}
          <div className="bottom-grid compact">
            <div className="bottom-card">
              <p className="small-sub">LATEST HR ACTIVITY</p>
              <div className="three-grid">
                {[
                  { name: "New Hires", amount: "12" },
                  { name: "Resignations", amount: "3" },
                  { name: "Promotions", amount: "5" },
                ].map((x) => (
                  <div key={x.name} className="mini-box compact">
                    <p className="mini-title">{x.name}</p>
                    <p className="mini-value">{x.amount}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bottom-card">
              <p className="small-sub">BRANCH DISTRIBUTION</p>
              <div className="map-box small-map">Map Placeholder</div>
            </div>

            <div className="bottom-card">
              <p className="small-sub">NOTES</p>
              <p className="note-text compact">
                Live HR data coming soon. Replace static placeholder widgets in production.
              </p>
              <div className="two-grid">
                <div className="note-small">
                  <p className="mini-title">EMPLOYEE COUNT</p>
                  <p className="mini-value">{summary.totalEmployees}</p>
                </div>

                <div className="note-small">
                  <p className="mini-title">ACTIVE ROLES</p>
                  <p className="mini-value">58</p>
                </div>
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
