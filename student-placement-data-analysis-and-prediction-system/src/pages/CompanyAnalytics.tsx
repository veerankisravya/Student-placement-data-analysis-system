import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Company, Student } from '../types';
import { GroupedBarChart } from '../components/Charts';

interface CompanyAnalyticsProps {
  companies: Company[];
  students: Student[];
}

export const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({
  companies,
  students,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCompanyModal, setActiveCompanyModal] = useState<Company | null>(null);

  const filteredCompanies = companies.filter((c) => {
    const matchTier = selectedTier === 'All' || c.tier.includes(selectedTier);
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTier && matchSearch;
  });

  // Chart data: Top 6 companies by recruited headcount and highest package
  const topCompanies = [...companies].sort((a, b) => b.recruitedCount - a.recruitedCount).slice(0, 6);
  const companyBarCategories = topCompanies.map((c) => c.logoText || c.name.slice(0, 8));
  const companyBarSeries = [
    {
      name: 'Candidates Recruited',
      color: '#0d9488',
      data: topCompanies.map((c) => c.recruitedCount),
    },
    {
      name: 'Avg Package (LPA)',
      color: '#6366f1',
      data: topCompanies.map((c) => c.avgPackageLPA),
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Recruiting Company & Industry Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Corporate recruitment volumes, package tiers, and branch-specific hiring distributions.
        </p>
      </div>

      {/* High-level Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Recruiter Network
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {companies.length} Companies
          </p>
          <span className="text-xs text-slate-500 mt-0.5 block">12 On-Campus + 6 Pool</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Super Dream Partners
          </span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {companies.filter((c) => c.tier.includes('Super Dream')).length}
          </p>
          <span className="text-xs text-slate-500 mt-0.5 block">&gt; 15.0 LPA compensation</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Max CTC Offered
          </span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            44.0 LPA
          </p>
          <span className="text-xs text-slate-500 mt-0.5 block">Google Software Engineering</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Bulk Recruiter Intake
          </span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
            56 Offers
          </p>
          <span className="text-xs text-slate-500 mt-0.5 block">TCS, Infosys & Accenture</span>
        </div>
      </div>

      {/* Recruiter Volume vs Compensation Chart */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Hiring Volume vs Average Package (LPA) by Recruiter
          </h3>
          <span className="text-xs text-slate-400 font-mono">Top 6 Recruiters</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Comparing headcount taken vs average compensation per company.
        </p>

        <GroupedBarChart
          categories={companyBarCategories}
          series={companyBarSeries}
          height={220}
          unit="Offers / LPA"
        />
      </div>

      {/* Filter and Search Bar for Company Directory */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search company or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Filter Tier:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Tiers</option>
            <option value="Super Dream">Super Dream (&gt; 15 LPA)</option>
            <option value="Dream">Dream (8-15 LPA)</option>
            <option value="Regular">Regular (&lt; 8 LPA)</option>
          </select>
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((c) => {
          const placedStudentsForComp = students.filter((s) => s.companyName && s.companyName.toLowerCase().includes(c.name.toLowerCase()));
          return (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-teal-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-teal-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                      {c.logoText}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {c.industry}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.tier.includes('Super Dream')
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : c.tier.includes('Dream')
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {c.tier.split(' ')[0]}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Offers</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {c.recruitedCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg CTC</span>
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                      {c.avgPackageLPA} LPA
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Max CTC</span>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {c.highestPackageLPA} LPA
                    </p>
                  </div>
                </div>

                {/* Target Branches */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Eligible Disciplines:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.departmentsHired.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {d.split('(')[1]?.replace(')', '') || d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Verified in campus drive</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {placedStudentsForComp.length} student records
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
