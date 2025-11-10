import PDFDocument from "pdfkit";
import Employee from "../models/Employee.js";

export const downloadReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    const employees = await Employee.find();

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Employee Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Date Range: ${start} to ${end}`);
    doc.moveDown();

    employees.forEach((emp) => {
      doc.text(`Name: ${emp.name}`);
      doc.text(`Email: ${emp.email}`);
      doc.text(`Department: ${emp.department}`);
      doc.text(`Salary: ${emp.salary}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.log("PDF Error:", err);
    res.status(500).json({ message: "Report creation failed" });
  }
};
