import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Student, Department, PlacementStatus } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  initialData?: Student | null;
}

const DEPARTMENTS: Department[] = [
  'Computer Science (CSE)',
  'AI & Data Science (AI&DS)',
  'Information Technology (IT)',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    department: 'Computer Science (CSE)' as Department,
    cgpa: 8.0,
    backlogs: 0,
    aptitudeScore: 75,
    technicalScore: 80,
    communicationScore: 75,
    technicalSkillsStr: 'Python, SQL, React',
    internshipMonths: 3,
    placementStatus: 'Placed' as PlacementStatus,
    companyName: 'TCS Digital',
    packageLPA: 7.5,
    graduationYear: 2024,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        gender: initialData.gender,
        department: initialData.department,
        cgpa: initialData.cgpa,
        backlogs: initialData.backlogs,
        aptitudeScore: initialData.aptitudeScore,
        technicalScore: initialData.technicalScore,
        communicationScore: initialData.communicationScore,
        technicalSkillsStr: initialData.technicalSkills.join(', '),
        internshipMonths: initialData.internshipMonths,
        placementStatus: initialData.placementStatus,
        companyName: initialData.companyName || '',
        packageLPA: initialData.packageLPA || 6.0,
        graduationYear: initialData.graduationYear,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        gender: 'Male',
        department: 'Computer Science (CSE)',
        cgpa: 8.0,
        backlogs: 0,
        aptitudeScore: 75,
        technicalScore: 80,
        communicationScore: 75,
        technicalSkillsStr: 'Python, SQL, React',
        internshipMonths: 3,
        placementStatus: 'Placed',
        companyName: 'TCS Digital',
        packageLPA: 7.5,
        graduationYear: 2024,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid institutional email is required';
    }
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0';
    }
    if (formData.aptitudeScore < 0 || formData.aptitudeScore > 100) {
      errs.aptitudeScore = 'Aptitude score must be between 0 and 100';
    }
    if (formData.technicalScore < 0 || formData.technicalScore > 100) {
      errs.technicalScore = 'Technical score must be between 0 and 100';
    }
    if (formData.communicationScore < 0 || formData.communicationScore > 100) {
      errs.communicationScore = 'Communication score must be between 0 and 100';
    }
    if (formData.placementStatus === 'Placed') {
      if (!formData.companyName.trim()) {
        errs.companyName = 'Company name is required for placed status';
      }
      if (!formData.packageLPA || formData.packageLPA <= 0) {
        errs.packageLPA = 'Package (LPA) must be greater than 0';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const skillsArray = formData.technicalSkillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      ...(initialData ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      email: formData.email.trim(),
      gender: formData.gender,
      department: formData.department,
      cgpa: Number(formData.cgpa),
      backlogs: Number(formData.backlogs),
      aptitudeScore: Number(formData.aptitudeScore),
      technicalScore: Number(formData.technicalScore),
      communicationScore: Number(formData.communicationScore),
      technicalSkills: skillsArray.length ? skillsArray : ['General Engineering'],
      internshipMonths: Number(formData.internshipMonths),
      placementStatus: formData.placementStatus,
      companyName: formData.placementStatus === 'Placed' ? formData.companyName.trim() : undefined,
      packageLPA: formData.placementStatus === 'Placed' ? Number(formData.packageLPA) : undefined,
      graduationYear: Number(formData.graduationYear),
      placedDate: formData.placementStatus === 'Placed' ? (initialData?.placedDate || new Date().toISOString().slice(0, 10)) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {initialData ? 'Edit Student Record' : 'Enroll New Student'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter academic metrics, skill evaluations, and placement outcome details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priyanshu Varma"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {errors.name && <span className="text-rose-500 text-[11px] mt-0.5">{errors.name}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="priyanshu@campus.edu.in"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {errors.email && <span className="text-rose-500 text-[11px] mt-0.5">{errors.email}</span>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Branch *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender & Graduation Year
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Academic & Evaluation Scores
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  CGPA (out of 10) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                />
                {errors.cgpa && <span className="text-rose-500 text-[10px]">{errors.cgpa}</span>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Active Backlogs
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.backlogs}
                  onChange={(e) => setFormData({ ...formData, backlogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Aptitude (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.aptitudeScore}
                  onChange={(e) => setFormData({ ...formData, aptitudeScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Technical (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.technicalScore}
                  onChange={(e) => setFormData({ ...formData, technicalScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Communication Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.communicationScore}
                  onChange={(e) => setFormData({ ...formData, communicationScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Internship Experience (Months)
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.internshipMonths}
                  onChange={(e) => setFormData({ ...formData, internshipMonths: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Technical Skills (separated by commas)
              </label>
              <input
                type="text"
                value={formData.technicalSkillsStr}
                onChange={(e) => setFormData({ ...formData, technicalSkillsStr: e.target.value })}
                placeholder="Python, React, AWS, Docker, Machine Learning"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Placement Status & Offer
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Status *
                </label>
                <select
                  value={formData.placementStatus}
                  onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value as PlacementStatus })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Placed">Placed</option>
                  <option value="Not Placed">Not Placed</option>
                  <option value="In Process">In Process</option>
                </select>
              </div>

              {formData.placementStatus === 'Placed' && (
                <>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Amazon, Google, TCS"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    {errors.companyName && <span className="text-rose-500 text-[10px]">{errors.companyName}</span>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Package (LPA) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      required
                      value={formData.packageLPA}
                      onChange={(e) => setFormData({ ...formData, packageLPA: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 12.5"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                    />
                    {errors.packageLPA && <span className="text-rose-500 text-[10px]">{errors.packageLPA}</span>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Record' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
