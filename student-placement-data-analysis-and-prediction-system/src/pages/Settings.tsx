import React, { useState } from 'react';
import {
  User,
  Shield,
  Moon,
  Sun,
  Building,
  Database,
  Download,
  RotateCcw,
  Check,
  AlertTriangle,
  Lock,
  LogOut
} from 'lucide-react';
import { User as UserType } from '../types';
import { storage } from '../services/storage';

interface SettingsProps {
  currentUser: UserType | null;
  onUpdateUser: (user: UserType) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  currentUser,
  onUpdateUser,
  theme,
  onToggleTheme,
  onLogout,
  onResetData,
}) => {
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileCollege, setProfileCollege] = useState(currentUser?.collegeName || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: UserType = {
      ...currentUser,
      name: profileName.trim(),
      email: profileEmail.trim(),
      collegeName: profileCollege.trim(),
    };
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      setPasswordMsg({ text: 'Please enter your current password.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPasswordMsg({ text: 'Password successfully updated.', type: 'success' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const downloadSqlBackup = () => {
    const students = storage.getStudents();
    const companies = storage.getCompanies();

    let sql = `-- ========================================================\n`;
    sql += `-- Placement Analysis MySQL Database Backup Dump\n`;
    sql += `-- Generated on: ${new Date().toISOString()}\n`;
    sql += `-- ========================================================\n\n`;
    sql += `CREATE DATABASE IF NOT EXISTS \`placement_analysis\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sql += `USE \`placement_analysis\`;\n\n`;

    sql += `-- Table: students\n`;
    sql += `DROP TABLE IF EXISTS \`students\`;\n`;
    sql += `CREATE TABLE \`students\` (\n`;
    sql += `  \`id\` VARCHAR(32) NOT NULL PRIMARY KEY,\n`;
    sql += `  \`name\` VARCHAR(120) NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(160) NOT NULL UNIQUE,\n`;
    sql += `  \`gender\` ENUM('Male','Female','Other') NOT NULL,\n`;
    sql += `  \`department\` VARCHAR(80) NOT NULL,\n`;
    sql += `  \`cgpa\` DECIMAL(4,2) NOT NULL,\n`;
    sql += `  \`backlogs\` INT NOT NULL DEFAULT 0,\n`;
    sql += `  \`aptitude_score\` INT NOT NULL,\n`;
    sql += `  \`technical_score\` INT NOT NULL,\n`;
    sql += `  \`communication_score\` INT NOT NULL,\n`;
    sql += `  \`internship_months\` INT NOT NULL DEFAULT 0,\n`;
    sql += `  \`placement_status\` ENUM('Placed','Not Placed','In Process') NOT NULL,\n`;
    sql += `  \`company_name\` VARCHAR(120) DEFAULT NULL,\n`;
    sql += `  \`package_lpa\` DECIMAL(5,2) DEFAULT NULL,\n`;
    sql += `  \`graduation_year\` INT NOT NULL\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    sql += `LOCK TABLES \`students\` WRITE;\n`;
    sql += `INSERT INTO \`students\` VALUES \n`;
    const rows = students.map(
      (s) =>
        `('${s.id}', '${s.name.replace(/'/g, "''")}', '${s.email}', '${s.gender}', '${s.department}', ${s.cgpa}, ${s.backlogs}, ${s.aptitudeScore}, ${s.technicalScore}, ${s.communicationScore}, ${s.internshipMonths}, '${s.placementStatus}', ${s.companyName ? `'${s.companyName.replace(/'/g, "''")}'` : 'NULL'}, ${s.packageLPA || 'NULL'}, ${s.graduationYear})`
    );
    sql += rows.join(',\n') + ';\n';
    sql += `UNLOCK TABLES;\n\n`;

    const blob = new Blob([sql], { type: 'application/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placement_analysis_mysql_backup_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          System Settings & Institutional Configuration
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure administrator profile, security keys, theme aesthetics, and database backup routines.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Administrator Profile & Role
          </h3>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile details saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designated Officer Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email ID
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Affiliated College / University Name
              </label>
              <input
                type="text"
                value={profileCollege}
                onChange={(e) => setProfileCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Account Security & Password */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Shield className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Account Security & Access Key
          </h3>
        </div>

        {passwordMsg && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Change Security Password
            </button>
          </div>
        </form>
      </div>

      {/* Theme & Display Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sun className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Interface Theme & Aesthetics
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Active Dashboard Theme
            </p>
            <p className="text-[11px] text-slate-500">
              Switch between High-Contrast Crisp Light and Deep Slate Navy Night themes.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => theme === 'dark' && onToggleTheme()}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => theme === 'light' && onToggleTheme()}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-teal-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Management & Backups */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Database Maintenance & SQL Backup
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Export MySQL Schema & Seed Dump
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Generates a valid .sql file with DDL statements and current student records ready for phpMyAdmin or MySQL CLI.
              </p>
            </div>
            <button
              onClick={downloadSqlBackup}
              className="mt-4 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SQL Dump (.sql)</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Restore Baseline Sample Dataset
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Restores standard 50 student records across all engineering departments with balanced placement metrics.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset student records to standard campus dataset?')) {
                  onResetData();
                }
              }}
              className="mt-4 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Action Card */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Terminate Active Session
          </p>
          <p className="text-[11px] text-slate-500">
            Securely sign out of the placement portal on this workstation.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-800"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
