import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();

  const assignedSubjects = [
    {
      name: 'Deep Learning',
      code: 'CS601',
      section: 'Section A',
      semester: 6,
      students: 42,
      averageAttendance: 84.5
    },
    {
      name: 'Web Technology',
      code: 'CS602',
      section: 'Section A',
      semester: 6,
      students: 42,
      averageAttendance: 88.0
    }
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
                Dept. of AIML &bull; 3rd Year Console
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Welcome, {user?.name || 'Dr. Alan Turing'}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Faculty ID: {user?.facultyProfile?.employeeId || 'VIGNAN-AIML-001'} &bull; Dept of Artificial Intelligence &amp; Machine Learning
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs shadow-md hover:bg-purple-50 transition border border-white">
            <ClipboardCheck className="w-4 h-4 text-brand-700" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Assigned Courses</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">2 Subjects</p>
          <span className="text-xs text-slate-500 mt-0.5 block">Deep Learning &amp; Web Tech</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">42 Students</p>
          <span className="text-xs text-slate-500 mt-0.5 block">Section A - 6th Semester</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Lectures Conducted</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">42 Sessions</p>
          <span className="text-xs text-slate-500 mt-0.5 block">Current Academic Term</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Correction Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">1 Pending</p>
          <span className="text-xs text-amber-700 font-medium mt-0.5 block">Requires faculty review</span>
        </div>
      </div>

      {/* Assigned Subjects Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">My Assigned Courses</h3>
            <p className="text-xs text-slate-500">Authorized courses for attendance taking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedSubjects.map((sub) => (
            <div
              key={sub.code}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
                    {sub.code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {sub.section} &bull; Sem {sub.semester}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">{sub.name}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                  <span>Enrolled: <strong>{sub.students}</strong></span>
                  <span>Avg Attendance: <strong className="text-emerald-600">{sub.averageAttendance}%</strong></span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                  <span>Mark Attendance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
