export type Department = 'Computer Science (CSE)' | 'Information Technology (IT)' | 'Electronics & Communication (ECE)' | 'Mechanical Engineering (ME)' | 'Civil Engineering (CE)' | 'AI & Data Science (AI&DS)';

export type PlacementStatus = 'Placed' | 'Not Placed' | 'In Process';

export interface Student {
  id: string; // e.g., 'STU-2024-001'
  name: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  department: Department;
  cgpa: number; // e.g., 8.45
  backlogs: number; // 0, 1, 2...
  aptitudeScore: number; // 0-100
  technicalScore: number; // 0-100
  communicationScore: number; // 0-100
  technicalSkills: string[]; // e.g., ['Python', 'SQL', 'React']
  internshipMonths: number; // 0, 3, 6...
  placementStatus: PlacementStatus;
  companyName?: string;
  packageLPA?: number; // In Lakhs Per Annum, e.g. 12.5
  graduationYear: number; // 2023, 2024, 2025, 2026
  placedDate?: string;
}

export interface Company {
  id: string;
  name: string;
  tier: 'Super Dream (> 15 LPA)' | 'Dream (8-15 LPA)' | 'Regular (< 8 LPA)';
  industry: string;
  avgPackageLPA: number;
  highestPackageLPA: number;
  recruitedCount: number;
  departmentsHired: Department[];
  logoText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Placement Officer' | 'Dean / Administrator' | 'Department Faculty';
  department?: string;
  collegeName: string;
  avatarUrl?: string;
}

export interface PlacementPredictionInput {
  cgpa: number;
  backlogs: number;
  aptitudeScore: number;
  technicalScore: number;
  communicationScore: number;
  internshipMonths: number;
  department: Department;
}

export interface PlacementPredictionResult {
  probabilityPercent: number;
  placementClassification: 'High Probability' | 'Moderate Probability' | 'Needs Improvement';
  estimatedPackageRange: string;
  topContributingFactors: { factor: string; impact: 'positive' | 'negative' | 'neutral'; score: number; description: string }[];
  tailoredRecommendations: string[];
}
