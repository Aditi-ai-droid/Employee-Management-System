
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard.css";

export default function EmployeeDashboard() {

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios
      .get("https://employee-management-api-msby.onrender.com/api/dashboard/summary")
      .then((res) => {

        setSummary(res.data);
        setLoading(false);

      })
      .catch((err) => {

        console.log("Dashboard API Error:", err);

        // fallback so dashboard still opens
        setSummary({
          totalEmployees: 0,
          attendanceRate: 0,
          departments: 0,
        });

        setLoading(false);

      });

  }, []);


  const handleDownload = async () => {

    try {

      const res = await axios.get(
        "https://employee-management-api-msby.onrender.com/api/dashboard/report",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "report.pdf");

      document.body.appendChild(link);

      link.click();

    } catch (err) {

      console.log("Report Download Error:", err);

    }
  };


  if (loading) {

    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Loading Dashboard...
      </h2>
    );

  }


  return (

    <div className="dashboard full-stretch">

      <div className="layout">


        {/* SIDEBAR */}

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

            <Link to="/dashboard" className="nav-item">🏠 Dashboard</Link>

            <Link to="/attendance" className="nav-item">🕒 Attendance</Link>

            <Link to="/employeeList" className="nav-item">👥 Employee List</Link>

            <Link to="/addEmployee" className="nav-item">➕ Add Employee</Link>

            <Link to="/reports" className="nav-item">📊 Reports</Link>

            <div className="nav-label">OTHER</div>

            <Link to="/signup" className="nav-item">🚪 Logout</Link>

          </div>

        </aside>


        {/* MAIN CONTENT */}

        <main className="main expanded">

          <div className="topbar">

            <div className="breadcrumb">
              HOME / EMPLOYEE / MANAGEMENT
            </div>

            <button
              className="button-primary"
              onClick={handleDownload}
            >
              Download Report
            </button>

          </div>


          <h2 className="main-heading">
            Employee Dashboard
          </h2>


          {/* STAT CARDS */}

          <div className="stats-grid enhanced">

            <div className="stat-box premium">
              <p className="stat-title">TOTAL EMPLOYEES</p>
              <h3 className="stat-value">
                {summary.totalEmployees}
              </h3>
            </div>


            <div className="stat-box premium">
              <p className="stat-title">ATTENDANCE RATE</p>
              <h3 className="stat-value">
                {summary.attendanceRate}%
              </h3>
            </div>


            <div className="stat-box premium">
              <p className="stat-title">DEPARTMENTS</p>
              <h3 className="stat-value">
                {summary.departments}
              </h3>
            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

