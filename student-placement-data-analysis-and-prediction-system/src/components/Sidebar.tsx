import React from 'react';
import {
  LayoutDashboard,
  Users,
  LineChart,
  BrainCircuit,
  Building2,
  FileSpreadsheet,
  Settings,
  Code2,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'analysis', label: 'Performance Analysis', icon: LineChart },
    { id: 'prediction', label: 'Placement Prediction', icon: BrainCircuit, badge: 'ML Model' },
    { id: 'companies', label: 'Company Analytics', icon: Building2 },
    { id: 'reports', label: 'Placement Reports', icon: FileSpreadsheet },
    { id: 'submission-kit', label: 'Python & MySQL Code', icon: Code2, badge: 'BTech Kit' },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col h-screen shrink-0 sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0 border border-slate-700/60 p-0.5">
          <img
            src="/src/assets/images/placement_cell_logo_1792730644831.jpg"
            alt="Placement Cell Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
            PlacementHQ
          </h1>
          <p className="text-[11px] text-teal-400 font-medium truncate">
            Student Analytics & ML
          </p>
        </div>
      </div>

      {/* College Info Pill */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/50 flex items-center gap-2 text-[11px] text-slate-400">
        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">{currentUser?.collegeName || 'National Engineering Institute'}</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 pt-1 text-[10px] font-semibold tracking-wider uppercase text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-950 text-teal-300 border border-teal-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-teal-800/60 border border-teal-600/40 text-teal-200 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'PO'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.name || 'Dr. Sharma'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.role || 'Placement Officer'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
