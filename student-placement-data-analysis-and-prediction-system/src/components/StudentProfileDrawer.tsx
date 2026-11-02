import React from 'react';
import { X, Award, Briefcase, GraduationCap, Calendar, CheckCircle2, AlertCircle, Edit, Trash2, Mail } from 'lucide-react';
import { Student } from '../types';
import { predictPlacement } from '../services/mlModel';

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!student) return null;

  const prediction = predictPlacement({
    cgpa: student.cgpa,
    backlogs: student.backlogs,
    aptitudeScore: student.aptitudeScore,
    technicalScore: student.technicalScore,
    communicationScore: student.communicationScore,
    internshipMonths: student.internshipMonths,
    department: student.department,
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-lg flex items-center justify-center border border-teal-200 dark:border-teal-800">
              {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {student.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {student.id} · {student.graduationYear} Batch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              student.placementStatus === 'Placed'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : student.placementStatus === 'In Process'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {student.placementStatus === 'Placed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {student.placementStatus === 'Placed'
                    ? `Placed at ${student.companyName}`
                    : `Status: ${student.placementStatus}`}
                </p>
                {student.placementStatus === 'Placed' && student.placedDate && (
                  <p className="text-[11px] opacity-80">
                    Offer accepted on {student.placedDate}
                  </p>
                )}
              </div>
            </div>
            {student.placementStatus === 'Placed' && student.packageLPA && (
              <div className="text-right">
                <span className="text-lg font-bold tabular-nums">
                  {student.packageLPA} LPA
                </span>
                <span className="block text-[10px] uppercase font-semibold opacity-75">
                  Package
                </span>
              </div>
            )}
          </div>

          {/* Contact & Bio Info */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Department</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {student.department}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Gender</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {student.gender}
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 font-mono">
                {student.email}
              </span>
            </div>
          </div>

          {/* Academic & Skill Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Evaluation Metrics
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">CGPA</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {student.cgpa}
                </p>
                <span className="text-[10px] text-slate-400">out of 10.0</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Backlogs</span>
                <p className={`text-base font-bold tabular-nums ${student.backlogs > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {student.backlogs}
                </p>
                <span className="text-[10px] text-slate-400">{student.backlogs === 0 ? 'Clean' : 'Active'}</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Internship</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {student.internshipMonths} Mo
                </p>
                <span className="text-[10px] text-slate-400">Industry Exp</span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-300">Technical Assessment</span>
                  <span className="tabular-nums font-semibold">{student.technicalScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${student.technicalScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-300">Quantitative & Aptitude</span>
                  <span className="tabular-nums font-semibold">{student.aptitudeScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${student.aptitudeScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-300">Communication & Soft Skills</span>
                  <span className="tabular-nums font-semibold">{student.communicationScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${student.communicationScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Verified Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {student.technicalSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-md font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* ML Readiness Evaluation */}
          <div className="p-4 rounded-xl border border-teal-200/70 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-teal-900 dark:text-teal-200">
                Placement Readiness Prediction
              </span>
              <span className="text-sm font-bold text-teal-700 dark:text-teal-300 tabular-nums">
                {prediction.probabilityPercent}%
              </span>
            </div>
            <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 mb-2">
              Estimated Bracket: <strong>{prediction.estimatedPackageRange}</strong>
            </p>
            <div className="space-y-1">
              {prediction.topContributingFactors.slice(0, 2).map((fac) => (
                <p key={fac.factor} className="text-[11px] text-slate-600 dark:text-slate-400">
                  • {fac.description}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${student.name}'s record?`)) {
                onDelete(student.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Record</span>
          </button>

          <button
            onClick={() => {
              onEdit(student);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
