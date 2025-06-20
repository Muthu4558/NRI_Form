import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCity } from 'react-icons/fa';
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
      Object.entries(entry.checklist || {}).filter(([_, v]) => v).map(([k]) => k).join(", "),
      entry.lovedOnes?.map(p =>
        `${p.name} (${p.age}, ${p.gender}, ${p.state}, ${p.district}, ${p.area})`
      ).join("; ")
    ]);
    doc.autoTable({
      head: [["#", "Name", "Email", "Phone", "Health Issues", "Checklist", "Loved Ones"]],
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
      Checklist: Object.entries(entry.checklist || {}).filter(([_, v]) => v).map(([k]) => k).join(", "),
      "Loved Ones": entry.lovedOnes?.map(p =>
        `${p.name} (${p.age}, ${p.gender}, ${p.state}, ${p.district}, ${p.area})`
      ).join("; ")
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "submissions.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md shadow-md rounded-xl px-6 py-4 mb-6 flex justify-between items-center border border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-700">📋 Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={downloadPDF} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow">
            📄 PDF
          </button>
          <button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow">
            📊 Excel
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {forms.map((entry, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-purple-800 mb-1 flex items-center gap-2">
                <FaUser /> {entry.firstName} {entry.lastName}
              </h2>
              <p className="text-sm text-gray-600 flex items-center"><FaEnvelope className="mr-2 text-blue-500" /> {entry.email}</p>
              <p className="text-sm text-gray-600 flex items-center"><FaPhone className="mr-2 text-green-600" /> {entry.mobile}</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-700">🩺 Health Issues:</h3>
              <p className="text-sm text-gray-700">{entry.healthIssues || 'None'}</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-700">✅ Checklist:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                {Object.entries(entry.checklist || {}).filter(([_, v]) => v).map(([k]) => (
                  <li key={k}>{k === 'bp' ? 'Blood Pressure' : k.charAt(0).toUpperCase() + k.slice(1)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">👨‍👩‍👧 Loved Ones:</h3>
              {entry.lovedOnes?.map((person, idx) => (
                <div key={idx} className="mt-2 p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <p className="text-sm font-medium text-gray-800">👤 {person.name}</p>
                  <p className="text-sm text-gray-600">Age: {person.age}</p>
                  <p className="text-sm text-gray-600">Gender: {person.gender}</p>
                  <p className="text-sm text-gray-600"><FaCity className="inline mr-1" /> State: {person.state}</p>
                  <p className="text-sm text-gray-600">District: {person.district}</p>
                  <p className="text-sm text-gray-600">Area: {person.area}</p>
                  <p className="text-sm text-gray-600">📞 Contact: {person.contact}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
