import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';

const initialDepartments = [
  {
    id: 1,
    name: 'Artificial Intelligence and Machine Learning',
    code: 'AIML',
    established: '2021',
    hod: 'Dr. Grace Hopper (Ph.D., IIT Madras)',
    facultyCount: 8,
    studentCount: 123,
    activeYears: '3rd Year & 4th Year',
    labs: ['NVIDIA GPU Computing Lab', 'Computer Vision & Robotics Lab', 'Edge AI Center'],
    status: 'Active Focus'
  },
  {
    id: 2,
    name: 'Computer Science and Engineering',
    code: 'CSE',
    established: '2008',
    hod: 'Dr. K. V. Rao',
    facultyCount: 24,
    studentCount: 480,
    activeYears: '1st - 4th Year',
    labs: ['Data Engineering Lab', 'Cloud & IoT Lab'],
    status: 'Operational'
  },
  {
    id: 3,
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    established: '2008',
    hod: 'Dr. S. Mukherjee',
    facultyCount: 18,
    studentCount: 360,
    activeYears: '1st - 4th Year',
    labs: ['VLSI Design Center', 'Embedded Systems Lab'],
    status: 'Operational'
  }
];

const ManageDepartments = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    established: '2026',
    hod: '',
    facultyCount: '5'
  });

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDept.name.trim() || !newDept.code.trim()) return;

    const created = {
      id: Date.now(),
      name: newDept.name.trim(),
      code: newDept.code.trim().toUpperCase(),
      established: newDept.established,
      hod: newDept.hod.trim() || 'Pending Appointment',
      facultyCount: parseInt(newDept.facultyCount, 10) || 1,
      studentCount: 0,
      activeYears: '1st Year',
      labs: ['General Computing Lab'],
      status: 'Operational'
    };

    setDepartments((prev) => [...prev, created]);
    setIsModalOpen(false);
    setAlertMsg(`Department "${created.name}" (${created.code}) created successfully!`);
    setNewDept({
      name: '',
      code: '',
      established: '2026',
      hod: '',
      facultyCount: '5'
    });
    setTimeout(() => setAlertMsg(''), 4000);
  };

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
                Academic Divisions &bull; Administration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Departments Management</h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Maintain academic departments, HOD assignments, and laboratory facilities across campus.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs shadow-md hover:bg-purple-50 transition border border-white"
          >
            <PlusCircle className="w-4 h-4 text-brand-700" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{alertMsg}</span>
          </div>
          <button onClick={() => setAlertMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.code}
            className={`p-6 rounded-2xl border transition-all ${
              dept.code === 'AIML'
                ? 'bg-gradient-to-b from-purple-50/70 to-white border-brand-300 shadow-md ring-2 ring-brand-500/10'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-md border ${
                  dept.code === 'AIML'
                    ? 'bg-brand-700 text-white border-brand-700 shadow-sm shadow-brand-700/30'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {dept.code}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Est. {dept.established}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-1">
              {dept.name}
            </h3>
            <p className="text-xs text-brand-800 font-semibold mb-4">
              HOD: {dept.hod}
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs text-slate-600">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Faculty Staff</span>
                <strong className="text-sm font-bold text-slate-800">{dept.facultyCount} Members</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Enrolled Students</span>
                <strong className="text-sm font-bold text-slate-800">{dept.studentCount} Students</strong>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                Specialized Labs
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dept.labs.map((lab) => (
                  <span
                    key={lab}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-700"
                  >
                    {lab}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Academic Department</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Information Technology"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Department Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT"
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={newDept.established}
                    onChange={(e) => setNewDept({ ...newDept, established: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Head of Department (HOD)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Smith"
                  value={newDept.hod}
                  onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-md transition"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;
