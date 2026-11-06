import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  BookOpen,
  Users,
  Layers,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Settings,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const subjects = [
    { name: 'Deep Learning', code: 'CS601', credits: 4, faculty: 'Dr. Alan Turing', status: 'Active' },
    { name: 'Web Technology', code: 'CS602', credits: 4, faculty: 'Dr. Alan Turing', status: 'Active' },
    { name: 'Computer Vision', code: 'CS603', credits: 3, faculty: 'Pending Assignment', status: 'Active' },
    { name: 'MLOps', code: 'CS604', credits: 3, faculty: 'Pending Assignment', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-950/20 border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                VIGNAN UNIVERSITY
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                Deemed to be University &bull; Academic Portal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {user?.name || 'Vignan Super Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Active Focus: AIML 3rd Year (Sections A, B, C) &bull; Multi-Department Architecture
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link
              to="/dashboard/subjects"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs shadow-md hover:bg-purple-50 transition border border-white"
            >
              <PlusCircle className="w-4 h-4 text-brand-700" />
              <span>Manage Subjects</span>
            </Link>
            <Link
              to="/dashboard/reports"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/dashboard/subjects"
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:border-brand-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 group-hover:text-brand-700">Total Subjects</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">4 Courses</p>
          <span className="text-xs text-brand-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>Manage Subjects</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/dashboard/departments"
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:border-brand-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 group-hover:text-brand-700">Department</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-brand-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">AIML</p>
          <span className="text-xs text-brand-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>View Departments</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/dashboard/sections"
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:border-brand-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 group-hover:text-brand-700">3rd Year Sections</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">Sec A, B, C</p>
          <span className="text-xs text-brand-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>Manage Sections</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/dashboard/faculty"
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:border-brand-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 group-hover:text-brand-700">Faculty &amp; Staff</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">Manage Faculty</p>
          <span className="text-xs text-brand-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>Assign Instructors</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Initial 4 Subjects Management Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Academic Subjects Roster</h3>
            <p className="text-xs text-slate-500">Manage curriculum and faculty mappings</p>
          </div>
          <Link
            to="/dashboard/subjects"
            className="text-xs font-semibold text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full border border-brand-200 transition flex items-center gap-1"
          >
            <span>Full Subject Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Subject Name</th>
                <th className="py-3 px-6">Code</th>
                <th className="py-3 px-6">Credits</th>
                <th className="py-3 px-6">Assigned Faculty</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>{sub.name}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{sub.code}</td>
                  <td className="py-4 px-6">{sub.credits} Credits</td>
                  <td className="py-4 px-6">
                    {sub.faculty === 'Pending Assignment' ? (
                      <span className="text-amber-600 font-normal italic text-xs">Unassigned</span>
                    ) : (
                      <span className="text-slate-700 font-semibold">{sub.faculty}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
