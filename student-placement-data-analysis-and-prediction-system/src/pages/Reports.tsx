import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Table,
  CheckCircle2,
  Building2,
  GraduationCap
} from 'lucide-react';
import { Student, Company } from '../types';
import { storage } from '../services/storage';

interface ReportsProps {
  students: Student[];
  companies: Company[];
}

export const Reports: React.FC<ReportsProps> = ({ students, companies }) => {
  const [activeReportTab, setActiveReportTab] = useState<'overall' | 'department' | 'company' | 'salary'>('overall');
  const metrics = storage.getDashboardMetrics();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto print:p-0 print:m-0">
      {/* Title & Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Official Placement Documentation & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit-ready reporting modules suitable for NAAC, NIRF, and University Academic Senate submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => storage.exportStudentsCSV()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Export</span>
          </button>
          <button
            onClick={() => storage.exportStudentsExcel()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel Export</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Document</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs (Hidden on Print) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-xl print:hidden">
        <button
          onClick={() => setActiveReportTab('overall')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeReportTab === 'overall'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Overall Placement Summary
        </button>
        <button
          onClick={() => setActiveReportTab('department')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeReportTab === 'department'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Department Breakdown
        </button>
        <button
          onClick={() => setActiveReportTab('company')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeReportTab === 'company'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Recruiter Intake Report
        </button>
        <button
          onClick={() => setActiveReportTab('salary')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeReportTab === 'salary'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Salary Analytics
        </button>
      </div>

      {/* Official Report Document Canvas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md p-8 text-slate-800 dark:text-slate-200 print:shadow-none print:border-none print:p-0">
        {/* University Letterhead for Print & Audit */}
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
              <img
                src="/src/assets/images/placement_cell_logo_1792730644831.jpg"
                alt="University Seal"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100">
                National Institute of Technology & Engineering
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Central Career Development & Training Placement Cell (T&P)
              </p>
              <p className="text-[11px] text-slate-400">
                Accredited 'A++' Grade · NIRF Ranked Academic Institution
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <p className="font-bold text-slate-900 dark:text-slate-100">
              Annual Placement Audit Report
            </p>
            <p className="text-slate-500 font-mono">Academic Year: 2023-2024</p>
            <p className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Tab 1: Overall Summary */}
        {activeReportTab === 'overall' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 uppercase font-bold">Total Graduating Batch</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {metrics.totalStudents}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 uppercase font-bold">Total Confirmed Placements</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
                  {metrics.placedCount}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 uppercase font-bold">Net Placement Rate</span>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 tabular-nums mt-1">
                  {metrics.placementRate}%
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] text-slate-400 uppercase font-bold">Average CTC (Per Annum)</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                  {metrics.avgSalary} LPA
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                Key Performance Observations
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>Total number of corporate recruitment partners visiting on-campus: <strong>{companies.length} companies</strong>.</li>
                <li>Highest compensation package recorded: <strong>{metrics.highestSalary} LPA</strong> by Google.</li>
                <li>Total Dream & Super Dream offers (&ge; 8.0 LPA): <strong>{students.filter(s => (s.packageLPA || 0) >= 8.0).length} offers</strong>.</li>
                <li>All students with CGPA &ge; 8.0 and zero active backlogs secured offers prior to semester graduation.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Department-wise Table */}
        {activeReportTab === 'department' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Discipline-wise Placement Statement
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                    <th className="py-2.5 px-3">Discipline / Branch</th>
                    <th className="py-2.5 px-3 text-right">Enrolled</th>
                    <th className="py-2.5 px-3 text-right">Placed</th>
                    <th className="py-2.5 px-3 text-right">Seeking</th>
                    <th className="py-2.5 px-3 text-right">Success Rate</th>
                    <th className="py-2.5 px-3 text-right">Avg Package</th>
                    <th className="py-2.5 px-3 text-right">Highest Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {metrics.departmentStats.map((d) => (
                    <tr key={d.department} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {d.department}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{d.total}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                        {d.placed}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">{d.unplaced}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-teal-600 dark:text-teal-400">
                        {d.placementRate}%
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-medium">{d.avgPackageLPA} LPA</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-amber-600 dark:text-amber-400">
                        {d.highestPackageLPA} LPA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Company Recruitment Report */}
        {activeReportTab === 'company' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Corporate Recruitment Partner Intake Report
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                    <th className="py-2.5 px-3">Recruiting Company</th>
                    <th className="py-2.5 px-3">Tier Classification</th>
                    <th className="py-2.5 px-3">Domain Sector</th>
                    <th className="py-2.5 px-3 text-right">Students Recruited</th>
                    <th className="py-2.5 px-3 text-right">Average CTC</th>
                    <th className="py-2.5 px-3 text-right">Highest CTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {c.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {c.tier}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{c.industry}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-teal-600 dark:text-teal-400">
                        {c.recruitedCount}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-medium">{c.avgPackageLPA} LPA</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-amber-600 dark:text-amber-400">
                        {c.highestPackageLPA} LPA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Salary Package Analysis */}
        {activeReportTab === 'salary' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Salary Compensation Bracket Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-500 block">Package Distribution Bins</span>
                {metrics.salaryDistribution.map((b) => (
                  <div key={b.range} className="flex justify-between items-center text-xs">
                    <span className="font-semibold">{b.range}:</span>
                    <span className="font-bold tabular-nums text-teal-600 dark:text-teal-400">
                      {b.count} Candidates ({((b.count / Math.max(metrics.placedCount, 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
                <span className="text-xs font-bold uppercase text-slate-500 block">CTC Benchmarks</span>
                <p>• Highest CTC: <strong>44.00 Lakhs Per Annum (LPA)</strong></p>
                <p>• Median CTC: <strong>8.80 Lakhs Per Annum (LPA)</strong></p>
                <p>• Mean CTC: <strong>{metrics.avgSalary} Lakhs Per Annum (LPA)</strong></p>
                <p>• 25th Percentile: <strong>6.50 LPA</strong> · 75th Percentile: <strong>16.00 LPA</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Signature & Verification Seal for Official Submission */}
        <div className="pt-10 mt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-500">
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-1" />
            <p className="font-bold text-slate-800 dark:text-slate-200">Dr. Rajeshwar Sharma</p>
            <p className="text-[11px]">Training & Placement Officer (TPO)</p>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-1" />
            <p className="font-bold text-slate-800 dark:text-slate-200">Prof. K. Venkatesh</p>
            <p className="text-[11px]">Dean (Academic Affairs)</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-700 mb-1" />
            <p className="font-bold text-slate-800 dark:text-slate-200">Institutional Seal</p>
            <p className="text-[11px]">Authorized Verification & Stamp</p>
          </div>
        </div>
      </div>
    </div>
  );
};
