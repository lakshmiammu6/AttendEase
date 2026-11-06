import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  FileText
} from 'lucide-react';

const mockDefaultersList = [
  {
    roll: '231FA04004',
    name: 'Ananya Sharma',
    section: 'Section A',
    subject: 'Computer Vision (AIML303)',
    attended: 12,
    total: 18,
    percentage: 66.7,
    shortage: 6
  },
  {
    roll: '231FA04018',
    name: 'Praveen Reddy',
    section: 'Section A',
    subject: 'Deep Learning (AIML301)',
    attended: 14,
    total: 22,
    percentage: 63.6,
    shortage: 10
  },
  {
    roll: '231FA04052',
    name: 'Manoj Kumar',
    section: 'Section B',
    subject: 'MLOps (AIML304)',
    attended: 13,
    total: 20,
    percentage: 65.0,
    shortage: 8
  },
  {
    roll: '231FA04067',
    name: 'Harika Chowdary',
    section: 'Section B',
    subject: 'Computer Vision (AIML303)',
    attended: 11,
    total: 18,
    percentage: 61.1,
    shortage: 10
  },
  {
    roll: '231FA04094',
    name: 'Srikar Varma',
    section: 'Section C',
    subject: 'Web Technology (AIML302)',
    attended: 13,
    total: 20,
    percentage: 65.0,
    shortage: 8
  }
];

const AdminReports = () => {
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotice, setExportNotice] = useState('');

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Roll Number,Student Name,Section,Subject,Attended,Total,Percentage,Consecutive Classes Needed'];
    const rows = filteredData.map(
      (d) => `${d.roll},${d.name},${d.section},${d.subject},${d.attended},${d.total},${d.percentage}%,${d.shortage}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vignan_AIML_Defaulters_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Spreadsheet report downloaded successfully (CSV format for Excel)!');
    setTimeout(() => setExportNotice(''), 4000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const filteredData = mockDefaultersList.filter((item) => {
    const matchesSec = selectedSection === 'All' || item.section === selectedSection;
    const matchesSub = selectedSubject === 'All' || item.subject.includes(selectedSubject);
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roll.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSec && matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-950/20 border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                VIGNAN UNIVERSITY
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                Audit &bull; Compliance &bull; Exports
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Attendance Reports &amp; Defaulter Analytics
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Generate official college attendance registers and shortage (&lt; 75%) exam exclusion lists.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs shadow-md hover:bg-purple-50 transition border border-white"
            >
              <Download className="w-4 h-4 text-brand-700" />
              <span>Export Excel (.csv)</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Defaulters</span>
          <p className="text-2xl font-bold text-red-600 mt-1">{mockDefaultersList.length} Students</p>
          <span className="text-[11px] text-slate-500">Across Sections A, B, C</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Section A Shortage</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">2 Cases</p>
          <span className="text-[11px] text-slate-500">Below 75% limit</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Section B Shortage</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">2 Cases</p>
          <span className="text-[11px] text-slate-500">Below 75% limit</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">Section C Shortage</span>
          <p className="text-2xl font-bold text-slate-800 mt-1">1 Case</p>
          <span className="text-[11px] text-slate-500">Below 75% limit</span>
        </div>
      </div>

      {/* Report Filters and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Cohort:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Sections (A, B, C)</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All 4 Subjects</option>
                <option value="Deep Learning">Deep Learning</option>
                <option value="Web Technology">Web Technology</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="MLOps">MLOps</option>
              </select>
            </div>
          </div>
        </div>

        {/* Defaulter Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Reg No.</th>
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-6">Section</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Classes (Attended / Held)</th>
                <th className="py-3 px-6">Current %</th>
                <th className="py-3 px-6">Shortage Recovery (3T - 4A)</th>
                <th className="py-3 px-6">Exam Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">
                    No defaulter records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.roll + item.subject} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-brand-800">
                      {item.roll}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {item.section}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{item.subject}</td>
                    <td className="py-4 px-6">
                      {item.attended} / {item.total} lectures
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-red-600">{item.percentage}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>Must attend next {item.shortage} classes</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        Ineligible (&lt; 75%)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
