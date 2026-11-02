import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  CheckCircle2,
  Building,
  UserCheck
} from 'lucide-react';
import { User, Student } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  onOpenAddModal: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onOpenAddModal,
  theme,
  onToggleTheme,
  students,
  onSelectStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Tab Titles mapping for breadcrumb
  const titles: Record<string, string> = {
    dashboard: 'Campus Placement Analytics',
    students: 'Student Information & Records',
    analysis: 'Skill & Academic Performance Analysis',
    prediction: 'ML Placement Probability Engine',
    companies: 'Recruiter & Industry Hiring Analytics',
    reports: 'Official Placement Documentation & Reports',
    'submission-kit': 'Python Flask & MySQL Implementation Kit',
    settings: 'Portal Configuration & Security',
  };

  const filteredStudents = searchQuery.trim()
    ? students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.companyName && s.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const notifications = [
    {
      id: 1,
      title: 'Google Selection Completed',
      desc: '4 students selected for Software Engineering role at 44.0 LPA.',
      time: '2 hours ago',
      type: 'success',
    },
    {
      id: 2,
      title: 'Microsoft Drive Result',
      desc: '6 candidates received full-time offer letters at 32-42 LPA.',
      time: '5 hours ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'Deloitte Pool Campus Scheduled',
      desc: 'Online aptitude assessment on Oct 25th for 2025 cohort.',
      time: '1 day ago',
      type: 'notice',
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Breadcrumb Left Zone */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Career Cell
        </span>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {titles[activeTab] || 'Dashboard'}
        </h2>
      </div>

      {/* Middle & Right Interactive Controls */}
      <div className="flex items-center gap-3">
        {/* Global Student Search */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student, roll ID, or company..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-56 md:w-72 pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Quick Search Dropdown */}
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden z-30">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-semibold text-slate-400">
                Matching Students ({filteredStudents.length})
              </div>
              {filteredStudents.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectStudent(s);
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{s.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {s.id} · {s.department.split('(')[1]?.replace(')', '') || s.department} · CGPA: {s.cgpa}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          s.placementStatus === 'Placed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {s.placementStatus === 'Placed' ? `${s.packageLPA} LPA` : s.placementStatus}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No students found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Recruitment Notifications"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Campus Drive Updates
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>
                  Close
                </span>
              </div>
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Add Student Action */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Student</span>
        </button>
      </div>
    </header>
  );
};
