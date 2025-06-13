import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCity } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Admin = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/form/all");
        const data = await res.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchData();
  }, []);

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
      entry.lovedOnes?.map(p => `${p.name} (${p.age}, ${p.gender}, ${p.city})`).join("; ")
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
      "Loved Ones": entry.lovedOnes?.map(p => `${p.name} (${p.age}, ${p.gender}, ${p.city})`).join("; ")
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "submissions.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">📋 Submitted Forms</h1>

      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={downloadPDF}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow"
        >
          📄 Download PDF
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow"
        >
          📊 Download Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {forms.map((entry, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition-all duration-300 border-l-8 border-purple-500"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                <FaUser className="text-purple-500 mr-2" /> {entry.firstName} {entry.lastName}
              </h2>
              <p className="text-sm text-gray-600 flex items-center"><FaEnvelope className="mr-2 text-blue-400" /> {entry.email}</p>
              <p className="text-sm text-gray-600 flex items-center"><FaPhone className="mr-2 text-green-500" /> {entry.mobile}</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-700">Health Issues:</h3>
              <p className="text-sm text-gray-600">{entry.healthIssues || 'None'}</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-700">Checklist:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {Object.entries(entry.checklist || {}).filter(([_, v]) => v).map(([k]) => (
                  <li key={k}>{k === 'bp' ? 'Blood Pressure' : k.charAt(0).toUpperCase() + k.slice(1)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Loved Ones:</h3>
              {entry.lovedOnes?.map((person, idx) => (
                <div key={idx} className="mt-2 p-3 rounded-xl bg-gray-50 border">
                  <p className="text-sm font-medium text-gray-800">👤 {person.name}</p>
                  <p className="text-sm text-gray-600">Age: {person.age}</p>
                  <p className="text-sm text-gray-600">Gender: {person.gender}</p>
                  <p className="text-sm text-gray-600 flex items-center"><FaCity className="mr-1" /> City: {person.city}</p>
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
