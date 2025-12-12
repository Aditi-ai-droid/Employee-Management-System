// ✅ EmployeeList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch Employees
  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => setEmployees([]));
  }, []);

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });

      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      alert("Error deleting employee.");
    }
  };

  // ✅ Filter employees
  const filtered = employees.filter((e) =>
    (e.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Print Single
  const handlePrint = (emp) => {
    const currentDate = new Date().toLocaleDateString();
    const html = `
      <div style="font-family: Poppins; text-align:center; padding:30px;">
        <h2 style="color:#2563eb">Employee Details</h2>
        <p>Generated: ${currentDate}</p>
        <table style="margin:0 auto; width:60%; border-collapse:collapse;">
          <tr><td><b>Name:</b></td><td>${emp.name}</td></tr>
          <tr><td><b>Position:</b></td><td>${emp.position}</td></tr>
          <tr><td><b>Salary:</b></td><td>₹${emp.salary}</td></tr>
        </table>
      </div>
    `;
    const win = window.open("", "_blank", "width=500,height=700");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  // ✅ Print All
  const handlePrintAll = () => {
    const currentDate = new Date().toLocaleDateString();
    const rows = employees
      .map(
        (e) => `
      <tr>
        <td>${e.name}</td>
        <td>${e.position}</td>
        <td>₹${e.salary}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <div style="font-family:Poppins; text-align:center; padding:30px;">
        <h2 style="color:#2563eb;">Employee Report</h2>
        <p>${currentDate}</p>
        <table style="width:80%; margin:0 auto; border-collapse:collapse;">
          <thead>
            <tr style="background:#e0f2fe;">
              <th>Name</th>
              <th>Position</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    const win = window.open("", "_blank", "width=900,height=1000");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <div className="employee-page">
      <div className="employee-container">

        {/* ✅ Header */}
        <div className="page-header">
          <img src="image/logo.png" className="header-logo" alt="" />
          <h1>Employee List</h1>
          <p>Manage and view all employees.</p>
        </div>

        {/* ✅ Stats + Buttons */}
        <div className="stats-actions">
          <div className="stats-container">
            <div className="stat-card">
              <h2>{employees.length}</h2>
              <p>Total Employees</p>
            </div>

            <div className="stat-card">
              <h2>
                ₹
                {employees
                  .reduce((sum, e) => sum + Number(e.salary || 0), 0)
                  .toLocaleString()}
              </h2>
              <p>Total Salary</p>
            </div>
          </div>

          <div className="button-group">
            <button className="add-btn" onClick={() => navigate("/addEmployee")}>
              + Add Employee
            </button>

            <button className="print-all-btn" onClick={handlePrintAll}>
              🖨 Print All
            </button>
          </div>
        </div>

        {/* ✅ Search */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ✅ Table */}
        <div className="employee-table">
          {filtered.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id}>
                    <td>{e.name}</td>
                    <td>{e.position}</td>
                    <td>₹{e.salary}</td>

                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit/${e._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(e._id)}
                      >
                        Delete
                      </button>

                      <button
                        className="print-btn"
                        onClick={() => handlePrint(e)}
                      >
                        🖨
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No employees found</p>
          )}
        </div>
      </div>
    </div>
  );
}
