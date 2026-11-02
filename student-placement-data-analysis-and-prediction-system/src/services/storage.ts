import { Student, Company, User, Department } from '../types';
import { INITIAL_STUDENTS, INITIAL_COMPANIES, HISTORICAL_YEAR_STATS } from '../data/initialData';

const STUDENTS_STORAGE_KEY = 'sp_students_data_v1';
const COMPANIES_STORAGE_KEY = 'sp_companies_data_v1';
const USER_STORAGE_KEY = 'sp_user_session_v2';
const SESSION_USER_STORAGE_KEY = 'sp_user_session_tab_v2';
const THEME_STORAGE_KEY = 'sp_theme_preference_v1';

export const storage = {
  getStudents(): Student[] {
    try {
      const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  },

  addStudent(student: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newId = `STU-2024-${String(students.length + 1).padStart(3, '0')}`;
    const newStudent: Student = {
      ...student,
      id: newId,
    };
    const updated = [newStudent, ...students];
    this.saveStudents(updated);
    return newStudent;
  },

  updateStudent(student: Student): void {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
      this.saveStudents(students);
    }
  },

  deleteStudent(id: string): void {
    const students = this.getStudents();
    const filtered = students.filter((s) => s.id !== id);
    this.saveStudents(filtered);
  },

  resetData(): void {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANIES));
  },

  getCompanies(): Company[] {
    try {
      const stored = localStorage.getItem(COMPANIES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANIES));
    return INITIAL_COMPANIES;
  },

  saveCompanies(companies: Company[]): void {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY) ?? sessionStorage.getItem(SESSION_USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      return null;
    }
    return null;
  },

  setCurrentUser(user: User | null, remember?: boolean): void {
    if (user) {
      const shouldRemember = remember ?? localStorage.getItem(USER_STORAGE_KEY) !== null;
      const storageArea = shouldRemember ? localStorage : sessionStorage;
      const otherStorageArea = shouldRemember ? sessionStorage : localStorage;
      storageArea.setItem(shouldRemember ? USER_STORAGE_KEY : SESSION_USER_STORAGE_KEY, JSON.stringify(user));
      otherStorageArea.removeItem(shouldRemember ? SESSION_USER_STORAGE_KEY : USER_STORAGE_KEY);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_USER_STORAGE_KEY);
    }
  },

  getTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  },

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Analytics Computation Engine
  getDashboardMetrics() {
    const students = this.getStudents();
    const totalStudents = students.length;
    const placedStudents = students.filter((s) => s.placementStatus === 'Placed');
    const placedCount = placedStudents.length;
    const unplacedCount = students.filter((s) => s.placementStatus === 'Not Placed').length;
    const inProcessCount = students.filter((s) => s.placementStatus === 'In Process').length;
    const placementRate = totalStudents > 0 ? Number(((placedCount / totalStudents) * 100).toFixed(1)) : 0;

    const packages = placedStudents.map((s) => s.packageLPA || 0).filter((p) => p > 0);
    const avgSalary = packages.length > 0 ? Number((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2)) : 0;
    const highestSalary = packages.length > 0 ? Math.max(...packages) : 0;

    // Branch / Department breakdown
    const departments: Department[] = [
      'Computer Science (CSE)',
      'AI & Data Science (AI&DS)',
      'Information Technology (IT)',
      'Electronics & Communication (ECE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering (CE)'
    ];

    const departmentStats = departments.map((dept) => {
      const deptStudents = students.filter((s) => s.department === dept);
      const deptPlaced = deptStudents.filter((s) => s.placementStatus === 'Placed');
      const deptPkgs = deptPlaced.map((s) => s.packageLPA || 0).filter((p) => p > 0);
      const avgPkg = deptPkgs.length > 0 ? Number((deptPkgs.reduce((a, b) => a + b, 0) / deptPkgs.length).toFixed(1)) : 0;
      const highestPkg = deptPkgs.length > 0 ? Math.max(...deptPkgs) : 0;
      const rate = deptStudents.length > 0 ? Number(((deptPlaced.length / deptStudents.length) * 100).toFixed(1)) : 0;

      return {
        department: dept,
        shortName: dept.split('(')[1]?.replace(')', '') || dept,
        total: deptStudents.length,
        placed: deptPlaced.length,
        unplaced: deptStudents.length - deptPlaced.length,
        placementRate: rate,
        avgPackageLPA: avgPkg,
        highestPackageLPA: highestPkg,
      };
    });

    // CGPA Distribution
    const cgpaDistribution = [
      { range: '< 7.0', count: students.filter((s) => s.cgpa < 7.0).length, placedCount: students.filter((s) => s.cgpa < 7.0 && s.placementStatus === 'Placed').length },
      { range: '7.0 - 7.9', count: students.filter((s) => s.cgpa >= 7.0 && s.cgpa < 8.0).length, placedCount: students.filter((s) => s.cgpa >= 7.0 && s.cgpa < 8.0 && s.placementStatus === 'Placed').length },
      { range: '8.0 - 8.9', count: students.filter((s) => s.cgpa >= 8.0 && s.cgpa < 9.0).length, placedCount: students.filter((s) => s.cgpa >= 8.0 && s.cgpa < 9.0 && s.placementStatus === 'Placed').length },
      { range: '9.0 - 10.0', count: students.filter((s) => s.cgpa >= 9.0).length, placedCount: students.filter((s) => s.cgpa >= 9.0 && s.placementStatus === 'Placed').length },
    ];

    // Salary Distribution
    const salaryDistribution = [
      { range: '< 6.0 LPA', count: placedStudents.filter((s) => (s.packageLPA || 0) < 6.0).length },
      { range: '6.0 - 10.0 LPA', count: placedStudents.filter((s) => (s.packageLPA || 0) >= 6.0 && (s.packageLPA || 0) < 10.0).length },
      { range: '10.0 - 20.0 LPA', count: placedStudents.filter((s) => (s.packageLPA || 0) >= 10.0 && (s.packageLPA || 0) < 20.0).length },
      { range: '20.0 - 35.0 LPA', count: placedStudents.filter((s) => (s.packageLPA || 0) >= 20.0 && (s.packageLPA || 0) < 35.0).length },
      { range: '> 35.0 LPA', count: placedStudents.filter((s) => (s.packageLPA || 0) >= 35.0).length },
    ];

    return {
      totalStudents,
      placedCount,
      unplacedCount,
      inProcessCount,
      placementRate,
      avgSalary,
      highestSalary,
      departmentStats,
      cgpaDistribution,
      salaryDistribution,
      historicalTrends: HISTORICAL_YEAR_STATS,
    };
  },

  // Export to CSV helper
  exportStudentsCSV(): void {
    const students = this.getStudents();
    const headers = [
      'Student ID',
      'Name',
      'Email',
      'Gender',
      'Department',
      'CGPA',
      'Backlogs',
      'Aptitude Score',
      'Technical Score',
      'Communication Score',
      'Internship (Months)',
      'Placement Status',
      'Company Name',
      'Package (LPA)',
      'Graduation Year',
      'Placed Date'
    ];

    const rows = students.map((s) => [
      s.id,
      `"${s.name}"`,
      s.email,
      s.gender,
      `"${s.department}"`,
      s.cgpa,
      s.backlogs,
      s.aptitudeScore,
      s.technicalScore,
      s.communicationScore,
      s.internshipMonths,
      s.placementStatus,
      `"${s.companyName || ''}"`,
      s.packageLPA || '',
      s.graduationYear,
      s.placedDate || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_placement_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export to Excel-compatible HTML format
  exportStudentsExcel(): void {
    const students = this.getStudents();
    let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"/><title>Student Placement Records</title></head>
    <body>
    <h2>Student Placement Data Analysis & Records</h2>
    <p>Export Date: ${new Date().toLocaleDateString()}</p>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">
      <tr style="background-color:#0F172A;color:#FFFFFF;font-weight:bold;">
        <th>Student ID</th><th>Name</th><th>Email</th><th>Gender</th><th>Department</th>
        <th>CGPA</th><th>Backlogs</th><th>Aptitude</th><th>Technical</th><th>Communication</th>
        <th>Internship (Mo)</th><th>Status</th><th>Company</th><th>Package (LPA)</th><th>Graduation Year</th>
      </tr>`;

    students.forEach((s) => {
      tableHtml += `<tr>
        <td>${s.id}</td><td>${s.name}</td><td>${s.email}</td><td>${s.gender}</td><td>${s.department}</td>
        <td>${s.cgpa}</td><td>${s.backlogs}</td><td>${s.aptitudeScore}</td><td>${s.technicalScore}</td><td>${s.communicationScore}</td>
        <td>${s.internshipMonths}</td><td>${s.placementStatus}</td><td>${s.companyName || '-'}</td><td>${s.packageLPA || '-'}</td><td>${s.graduationYear}</td>
      </tr>`;
    });

    tableHtml += `</table></body></html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_placement_records_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
