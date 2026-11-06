import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            Administrator
          </span>
        );
      case 'faculty':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            Faculty Member
          </span>
        );
      case 'student':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            Student
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-800 bg-brand-100/80 px-2 py-0.5 rounded border border-brand-200">
              VIGNAN UNIVERSITY
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">|</span>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              Dept. of AIML (3rd Year)
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
            Attend<span className="text-brand-700">Ease</span> Management Console
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* User info card */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name || 'User'}
            </div>
            <div className="mt-0.5">{getRoleBadge(role)}</div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          title="Sign out"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 hover:border-red-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
