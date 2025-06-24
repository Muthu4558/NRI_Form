import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const Admin = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/form/all`);
        const data = await res.json();
        console.log("Fetched submissions:", data);
        setForms(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.success("Logged out successfully!");
    navigate('/');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Submitted Forms", 14, 10);
    const tableData = forms.map((entry, i) => [
      i + 1,
      `${entry.firstName} ${entry.lastName}`,
      entry.email,
      entry.mobile,
      entry.healthIssues || "None",
      (entry.lovedOnes || []).map(p =>
        `${p.name} (${p.age}, ${p.gender}, ${p.state}, ${p.district}, ${p.area})`
      ).join("; ")
    ]);

    doc.autoTable({
      head: [["#", "Name", "Email", "Phone", "Health Issues", "Loved Ones"]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 }
    });
    doc.save("submissions.pdf");
  };

  const downloadExcel = () => {
    const worksheetData = forms.map((entry, i) => ({
      "S.No": i + 1,
      Name: `${entry.firstName} ${entry.lastName}`,
      Email: entry.email,
      Phone: entry.mobile,
      "Health Issues": entry.healthIssues || "None",
      "Loved Ones": (entry.lovedOnes || []).map(p =>
        `${p.name} (${p.age}, ${p.gender}, ${p.state}, ${p.district}, ${p.area})`
      ).join("; ")
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "submissions.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-green-50 to-teal-100 p-6">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border border-gray-200 rounded-xl px-6 py-4 mb-6 flex flex-col md:flex-row justify-between items-center shadow gap-4">
        <h1 className="text-3xl font-bold text-teal-600 text-center md:text-left">Admin Dashboard</h1>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={downloadPDF} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full shadow">PDF</button>
          <button onClick={downloadExcel} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full shadow">Excel</button>
          <button onClick={handleLogout} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-full shadow">Logout</button>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl shadow-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-green-500 to-teal-600 text-white shadow text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Contact Info</th>
              <th className="px-4 py-3">Loved Ones</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {forms.map((entry, i) => (
              <tr key={i} className="hover:bg-teal-50 transition-all duration-300 group">
                <td className="px-4 py-3 font-semibold text-gray-600">{i + 1}</td>
                <td className="px-4 py-3 space-y-1">
                  <div className="font-semibold text-gray-800">{entry.firstName} {entry.lastName}</div>
                  <div className="font-light text-gray-600">{entry.email}</div>
                  <div className="font-light text-gray-600">{entry.mobile}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    {(entry.lovedOnes || []).map((p, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-white via-gray-50 to-white p-4 rounded-xl shadow border border-gray-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-semibold text-teal-700">{p.name}</h4>
                          <span className="text-sm text-teal-600 font-medium">{p.age} yrs, {p.gender}</span>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">{p.state}, {p.district}</div>
                        <div className="text-sm text-gray-600 font-medium">Pincode: {p.area}</div>
                        <div className="text-sm text-gray-600 font-medium">{p.contact}</div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this entry?")) {
                        toast.success("Entry deleted successfully!");
                      }
                    }}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-full font-semibold shadow-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
