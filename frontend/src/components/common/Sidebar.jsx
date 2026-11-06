
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Users,
  CalendarDays,
  Calculator,
  GitPullRequest,
  FileSpreadsheet,
  Layers,
  Building2,
  Landmark,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  // Navigation links based on user role
  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Manage Subjects', path: '/dashboard/subjects', icon: BookOpen },
          { name: 'Manage Faculty', path: '/dashboard/faculty', icon: Users },
          { name: 'Sections', path: '/dashboard/sections', icon: Layers },
          { name: 'Department', path: '/dashboard/departments', icon: Building2 },
          { name: 'Institute', path: '/dashboard/institute', icon: Landmark },
          { name: 'Reports', path: '/dashboard/reports', icon: FileSpreadsheet }
        ];

      case 'faculty':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Mark Attendance', path: '/dashboard/mark-attendance', icon: ClipboardCheck },
          { name: 'Attendance History', path: '/dashboard/history', icon: CalendarDays },
          { name: 'Correction Requests', path: '/dashboard/corrections', icon: GitPullRequest },
          { name: 'Export Sheets', path: '/dashboard/reports', icon: FileSpreadsheet }
        ];

      case 'student':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Subject Analytics', path: '/dashboard/analytics', icon: BookOpen },
          { name: 'Shortage Calculator', path: '/dashboard/calculator', icon: Calculator },
          { name: 'Correction Requests', path: '/dashboard/corrections', icon: GitPullRequest }
        ];

      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
        ];
    }
  };

  const navLinks = getNavLinks();

  // Display section information based on role
  const getDepartmentInfo = () => {
    switch (role) {
      case 'admin':
        return 'AIML • 3rd Year (Sec A, B, C)';

      case 'faculty':
        return 'AIML • 3rd Year (Sec A)';

      case 'student':
        return 'AIML • 3rd Year (Sec A)';

      default:
        return 'AIML • 3rd Year';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-400 flex items-center justify-center shadow-lg shadow-brand-700/30 shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-300 block leading-tight">
                VIGNAN UNIVERSITY
              </span>

              <span className="font-extrabold text-base tracking-tight text-white block">
                Attend<span className="text-brand-400">Ease</span>
              </span>

              <p className="text-[10px] text-slate-400 font-medium">
                {getDepartmentInfo()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Navigation
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/50'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer: Server Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              Backend Connected
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5">
            API: localhost:5000
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
