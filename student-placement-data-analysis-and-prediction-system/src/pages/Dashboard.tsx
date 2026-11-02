import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  Banknote,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  BrainCircuit,
  Building2,
  Plus
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { DoughnutChart, GroupedBarChart, TrendLineChart, HorizontalBars } from '../components/Charts';
import { storage } from '../services/storage';
import { Student, Company } from '../types';

interface DashboardProps {
  students: Student[];
  companies: Company[];
  onOpenAddModal: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  companies,
  onOpenAddModal,
  onNavigateTab,
  onSelectStudent,
}) => {
  const metrics = storage.getDashboardMetrics();

  // Top companies sorted by recruitment count
  const sortedCompanies = [...companies].sort((a, b) => b.recruitedCount - a.recruitedCount).slice(0, 5);

  // Recent placed students
  const recentPlacements = students
    .filter((s) => s.placementStatus === 'Placed')
    .sort((a, b) => (b.placedDate || '').localeCompare(a.placedDate || ''))
    .slice(0, 6);

  // Doughnut data
  const doughnutData = [
    { label: 'Placed', value: metrics.placedCount, color: '#0d9488' },
    { label: 'Not Placed', value: metrics.unplacedCount, color: '#f43f5e' },
    { label: 'In Process', value: metrics.inProcessCount, color: '#f59e0b' },
  ];

  // Branch-wise grouped bar chart
  const branchCategories = metrics.departmentStats.map((d) => d.shortName);
  const branchSeries = [
    {
      name: 'Placed',
      color: '#0d9488',
      data: metrics.departmentStats.map((d) => d.placed),
    },
    {
      name: 'Unplaced',
      color: '#cbd5e1',
      data: metrics.departmentStats.map((d) => d.unplaced),
    },
  ];

  // CGPA distribution bar chart
  const cgpaCategories = metrics.cgpaDistribution.map((c) => c.range);
  const cgpaSeries = [
    {
      name: 'Total Enrolled',
      color: '#64748b',
      data: metrics.cgpaDistribution.map((c) => c.count),
    },
    {
      name: 'Placed Students',
      color: '#0ea5e9',
      data: metrics.cgpaDistribution.map((c) => c.placedCount),
    },
  ];

  // Department Placement Rate horizontal progress bars
  const deptProgressItems = metrics.departmentStats.map((d) => ({
    label: d.department,
    sub: `${d.placed} / ${d.total} placed`,
    value: d.placementRate,
    maxValue: 100,
    valueDisplay: `${d.placementRate}%`,
    color: d.placementRate >= 85 ? '#0d9488' : d.placementRate >= 70 ? '#0284c7' : '#eab308',
  }));

  // Salary histogram items
  const salaryHistogramItems = metrics.salaryDistribution.map((s) => ({
    label: s.range,
    value: s.count,
    maxValue: Math.max(...metrics.salaryDistribution.map((x) => x.count), 1),
    valueDisplay: `${s.count} offers`,
    color: s.range.includes('35') ? '#8b5cf6' : s.range.includes('20') ? '#0d9488' : '#0284c7',
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Institutional Placement Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics across academic performance, campus drives, and recruitment outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Generate Reports</span>
          </button>
          <button
            onClick={() => onNavigateTab('prediction')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>ML Prediction</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Students"
          value={metrics.totalStudents}
          subtitle="Enrolled cohort"
          icon={Users}
          badge={{ text: '2024 Batch', trend: 'neutral' }}
          accentColor="#0284c7"
        />
        <MetricCard
          title="Students Placed"
          value={metrics.placedCount}
          subtitle={`${metrics.placedCount} verified offers`}
          icon={UserCheck}
          badge={{ text: '+6.8% YoY', trend: 'up' }}
          accentColor="#0d9488"
        />
        <MetricCard
          title="Not Yet Placed"
          value={metrics.unplacedCount}
          subtitle={`${metrics.inProcessCount} currently in drive`}
          icon={UserX}
          badge={{ text: 'Seeking', trend: 'neutral' }}
          accentColor="#f43f5e"
        />
        <MetricCard
          title="Placement Rate"
          value={`${metrics.placementRate}%`}
          subtitle="Institutional metric"
          icon={Percent}
          badge={{ text: 'Target 90%', trend: 'up' }}
          accentColor="#10b981"
        />
        <MetricCard
          title="Average Package"
          value={`${metrics.avgSalary} LPA`}
          subtitle="Annual CTC average"
          icon={Banknote}
          badge={{ text: '+14.2% YoY', trend: 'up' }}
          accentColor="#8b5cf6"
        />
        <MetricCard
          title="Highest Package"
          value={`${metrics.highestSalary} LPA`}
          subtitle="Google Software Engineer"
          icon={Trophy}
          badge={{ text: 'All-time High', trend: 'up' }}
          accentColor="#f59e0b"
        />
      </div>

      {/* Row 1: Primary Visual Charts (Doughnut & Branch Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doughnut: Placed vs Unplaced */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Placement Outcome Ratio
              </h3>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold tabular-nums">
                {metrics.placementRate}% Success
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Placed vs. Unplaced students distribution across 2024 cohort.
            </p>
          </div>

          <div className="my-auto py-2">
            <DoughnutChart
              data={doughnutData}
              size={190}
              centerLabel={`${metrics.placedCount}`}
              centerSub="Placed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Drive Attendance</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">98.4%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Avg Offers/Placed</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">1.42</span>
            </div>
          </div>
        </div>

        {/* Branch-wise Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Department-wise Recruitment Comparison
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Headcount comparison by branch
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Comparative volume of placed vs unplaced candidates per academic discipline.
            </p>
          </div>

          <div className="my-auto">
            <GroupedBarChart
              categories={branchCategories}
              series={branchSeries}
              height={220}
              unit="Students"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Highest conversion: <strong>Computer Science (94.1%)</strong></span>
            <span>Core disciplines (ME & CE) placing in L&T, Tata Motors & IT consultancies</span>
          </div>
        </div>
      </div>

      {/* Row 2: Trend Line Chart & Department Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Placement Trends Across Academic Years */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Historical Placement Trend (2021 – 2025)
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +16.2% 5-Yr Growth
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Placement success rate (%) trajectory over successive graduating batches.
          </p>

          <TrendLineChart
            years={metrics.historicalTrends.map((h) => h.year)}
            rates={metrics.historicalTrends.map((h) => h.placementRate)}
            salaries={metrics.historicalTrends.map((h) => h.avgSalaryLPA)}
            height={210}
          />
        </div>

        {/* Placement Percentage by Department */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Placement Percentage by Department
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Clear benchmark of conversion efficiency by branch.
            </p>
          </div>

          <div className="my-auto py-1">
            <HorizontalBars items={deptProgressItems} />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 flex justify-between">
            <span>Overall campus average: <strong>{metrics.placementRate}%</strong></span>
            <button onClick={() => onNavigateTab('analysis')} className="text-teal-600 dark:text-teal-400 hover:underline font-semibold">
              Deep dive &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: CGPA Distribution & Salary Package Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CGPA Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              CGPA Distribution & Placement Conversion
            </h3>
            <span className="text-xs text-slate-500">Graduating Cohort</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Correlation between academic CGPA tiers and successful campus placement conversion.
          </p>

          <GroupedBarChart
            categories={cgpaCategories}
            series={cgpaSeries}
            height={200}
            unit="Candidates"
          />
        </div>

        {/* Salary Package Histogram */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Salary Package Distribution (LPA)
              </h3>
              <span className="text-xs text-slate-400 font-mono">CTC Bins</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Spread of accepted compensation packages across recruited talent.
            </p>
          </div>

          <div className="my-auto py-1">
            <HorizontalBars items={salaryHistogramItems} />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 flex justify-between">
            <span>Median Package: <strong>8.8 LPA</strong></span>
            <span>Super-dream (&gt;15 LPA): <strong>{students.filter(s => (s.packageLPA || 0) >= 15).length} students</strong></span>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Placements Table & Top Recruiting Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Placements Activity */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Recent Placement Activities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest student offers finalized and verified by the training & placement cell.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View All Records</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3 text-right">Package</th>
                  <th className="py-2.5 px-3 text-right">Date</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentPlacements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{s.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{s.id}</p>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {s.department.split('(')[1]?.replace(')', '') || s.department}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {s.companyName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                      {s.packageLPA} LPA
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                      {s.placedDate || 'Recent'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectStudent(s)}
                        className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Recruiting Companies */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Top Hiring Partners
              </h3>
              <button
                onClick={() => onNavigateTab('companies')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Analytics &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Companies recruiting highest volume of candidates this season.
            </p>
          </div>

          <div className="space-y-2.5 my-auto">
            {sortedCompanies.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-900 text-teal-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {c.logoText}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {c.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Avg: {c.avgPackageLPA} LPA · Max: {c.highestPackageLPA} LPA
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {c.recruitedCount}
                  </span>
                  <span className="block text-[10px] text-slate-400">offers</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <span className="text-xs text-slate-400">
              Total active recruiter portfolio: <strong>{companies.length} corporate partners</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
