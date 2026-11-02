import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  FileText,
  RotateCcw
} from 'lucide-react';
import { Student, Department, PlacementStatus } from '../types';
import { storage } from '../services/storage';

interface StudentManagementProps {
  students: Student[];
  onOpenAddModal: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudent: (student: Student) => void;
  onReloadData: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onOpenAddModal,
  onEditStudent,
  onDeleteStudent,
  onSelectStudent,
  onReloadData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCgpa, setSelectedCgpa] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  
  // Sorting
  const [sortField, setSortField] = useState<keyof Student>('cgpa');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter & Sort logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.companyName && s.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Department
      const matchDept = selectedDept === 'All' || s.department === selectedDept;

      // Status
      const matchStatus = selectedStatus === 'All' || s.placementStatus === selectedStatus;

      // CGPA
      let matchCgpa = true;
      if (selectedCgpa === '>= 9.0') matchCgpa = s.cgpa >= 9.0;
      else if (selectedCgpa === '8.0 - 8.9') matchCgpa = s.cgpa >= 8.0 && s.cgpa < 9.0;
      else if (selectedCgpa === '7.0 - 7.9') matchCgpa = s.cgpa >= 7.0 && s.cgpa < 8.0;
      else if (selectedCgpa === '< 7.0') matchCgpa = s.cgpa < 7.0;

      // Year
      const matchYear = selectedYear === 'All' || String(s.graduationYear) === selectedYear;

      return matchSearch && matchDept && matchStatus && matchCgpa && matchYear;
    });
  }, [students, searchTerm, selectedDept, selectedStatus, selectedCgpa, selectedYear]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredStudents, sortField, sortOrder]);

  // Paginated records
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedStatus('All');
    setSelectedCgpa('All');
    setSelectedYear('All');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Title and Export/Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Student Placement Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, edit, and audit candidate eligibility metrics and recruitment statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => storage.exportStudentsCSV()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => storage.exportStudentsExcel()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel (.xls)</span>
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

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, ID, or company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science (CSE)">CSE</option>
              <option value="AI & Data Science (AI&DS)">AI & Data Science</option>
              <option value="Information Technology (IT)">IT</option>
              <option value="Electronics & Communication (ECE)">ECE</option>
              <option value="Mechanical Engineering (ME)">Mechanical</option>
              <option value="Civil Engineering (CE)">Civil</option>
            </select>
          </div>

          {/* Placement Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Not Placed">Not Placed</option>
              <option value="In Process">In Process</option>
            </select>
          </div>

          {/* CGPA Range */}
          <div>
            <select
              value={selectedCgpa}
              onChange={(e) => {
                setSelectedCgpa(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All CGPA Scores</option>
              <option value=">= 9.0">&gt;= 9.0 (Distinction)</option>
              <option value="8.0 - 8.9">8.0 - 8.9 (First Class w/ Merit)</option>
              <option value="7.0 - 7.9">7.0 - 7.9 (First Class)</option>
              <option value="< 7.0">&lt; 7.0 (Second Class)</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Years</option>
              <option value="2023">2023 Batch</option>
              <option value="2024">2024 Batch</option>
              <option value="2025">2025 Batch</option>
              <option value="2026">2026 Batch</option>
            </select>

            {(searchTerm || selectedDept !== 'All' || selectedStatus !== 'All' || selectedCgpa !== 'All' || selectedYear !== 'All') && (
              <button
                onClick={resetFilters}
                title="Clear all filters"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Stats Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> enrolled students
          </div>
          <div className="flex items-center gap-3">
            <span>Placed: <strong>{filteredStudents.filter((s) => s.placementStatus === 'Placed').length}</strong></span>
            <span>·</span>
            <span>Seeking: <strong>{filteredStudents.filter((s) => s.placementStatus === 'Not Placed').length}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center gap-1">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center gap-1">
                    <span>Candidate Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  className="py-3 px-4 cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center gap-1">
                    <span>Branch</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cgpa')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>CGPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('backlogs')}
                  className="py-3 px-3 text-center cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Backlogs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('technicalScore')}
                  className="py-3 px-3 text-center cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Tech / Apt</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('placementStatus')}
                  className="py-3 px-4 cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Offer / Company</th>
                <th
                  onClick={() => handleSort('packageLPA')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-teal-600"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Package</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {s.id}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectStudent(s)}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 text-left transition-colors"
                      >
                        {s.name}
                      </button>
                      <p className="text-[11px] text-slate-400 font-mono">{s.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <span className="font-medium">
                        {s.department.split('(')[1]?.replace(')', '') || s.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {s.cgpa}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          s.backlogs === 0 ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {s.backlogs}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums text-slate-600 dark:text-slate-300">
                      {s.technicalScore} / {s.aptitudeScore}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.placementStatus === 'Placed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : s.placementStatus === 'In Process'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {s.placementStatus === 'Placed' && <CheckCircle2 className="w-3 h-3" />}
                        {s.placementStatus === 'In Process' && <Clock className="w-3 h-3" />}
                        {s.placementStatus === 'Not Placed' && <XCircle className="w-3 h-3" />}
                        <span>{s.placementStatus}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {s.companyName ? (
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[140px] block">
                          {s.companyName}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {s.packageLPA ? (
                        <span className="font-bold text-teal-600 dark:text-teal-400">
                          {s.packageLPA} LPA
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectStudent(s)}
                          title="View Profile Details"
                          className="p-1 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(s)}
                          title="Edit Student"
                          className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${s.name}?`)) {
                              onDeleteStudent(s.id);
                            }
                          }}
                          title="Delete Record"
                          className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <p className="font-medium">No student records match the active criteria.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs text-teal-600 dark:text-teal-400 underline font-semibold"
                    >
                      Clear active filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded text-xs font-semibold tabular-nums ${
                  currentPage === pg
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
