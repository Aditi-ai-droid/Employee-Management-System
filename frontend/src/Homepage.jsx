import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

function Homepage() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        const user = JSON.parse(userData);
        setUserName(user.name);
      }
    } catch (error) {
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.info("Logged out successfully!", {
      position: "top-center",
      autoClose: 1500,
    });

    setTimeout(() => {
      navigate("/signup");
    }, 1600);
  };

  const handleGetStarted = () => {
    if (userName) {
      navigate("/dashboard");
    } else {
      toast.warning("Please sign up or log in first!", {
        position: "top-center",
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/signup");
      }, 1600);
    }
  };

  return (
    <div className="background">
      <ToastContainer />

      {/* Floating Abstract Circles */}
      <div className="floating-circle circle1"></div>
      <div className="floating-circle circle2"></div>
      <div className="floating-circle circle3"></div>

      {/* Main Content */}
      <div className="main-container">

        {/* ✅ Updated Navbar */}
        <header className="navbar">
          <div className="logo">
            <img src="image/logo.png" alt="EmployeeHub Logo" />
           
          </div>

          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/employeeList">Employee List</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/dashboard">Dashboard</Link>

            {userName ? (
              <span className="logout-btn" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </span>
            ) : (
              <Link to="/signup">Signup</Link>
            )}
          </nav>
        </header>

        {/* ✅ Hero Section */}
        <section className="hero">
          <div className="hero-left">
            <h1>
              {userName
                ? `Welcome back, ${userName}! 👋`
                : "Manage your Workforce with ease."}
            </h1>
            <div className="line-accent"></div>
            <p>
              Simplify employee management — track attendance, monitor
              performance, and manage records all in one intuitive dashboard.
            </p>

            <button className="cta-btn" onClick={handleGetStarted}>
              🚀 Get Started
            </button>

            <div className="stats">
              <div>
                <h3>150+</h3>
                <p>Active Employees</p>
              </div>
              <div>
                <h3>25</h3>
                <p>Departments</p>
              </div>
              <div>
                <h3>98%</h3>
                <p>Attendance</p>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="image/illustration.png"
              alt="Employee Illustration"
              className="hero-image"
            />

            <div className="floating-card top-right">
              <h4>250+</h4>
              <p>Reports Generated</p>
            </div>

            <div className="floating-card bottom-left">
              <h4>95%</h4>
              <p>Performance Rate</p>
            </div>
          </div>
        </section>

        <footer>
          <p>© 2025 Employee Management System | Designed by Aditi Sundaram</p>
        </footer>
      </div>
    </div>
  );
}

export default Homepage;
