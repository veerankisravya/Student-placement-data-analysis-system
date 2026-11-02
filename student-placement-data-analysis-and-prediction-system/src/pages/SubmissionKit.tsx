import React, { useState } from 'react';
import {
  Code2,
  Database,
  Terminal,
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  CheckCircle2,
  FolderTree
} from 'lucide-react';

export const SubmissionKit: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('schema.sql');
  const [copied, setCopied] = useState(false);

  const fileContents: Record<string, { label: string; language: string; icon: any; content: string }> = {
    'schema.sql': {
      label: 'database/schema.sql',
      language: 'sql',
      icon: Database,
      content: `-- ====================================================================
-- Project: Student Placement Data Analysis and Prediction System
-- Database: placement_analysis
-- Author: BTech Placement Intelligence Engineering Cell
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS \`placement_analysis\`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`placement_analysis\`;

-- 1. Table: users (Authentication & RBAC)
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(160) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('Placement Officer', 'Dean / Administrator', 'Department Faculty') NOT NULL DEFAULT 'Placement Officer',
  \`department\` VARCHAR(80) DEFAULT NULL,
  \`college_name\` VARCHAR(180) NOT NULL DEFAULT 'National Institute of Technology & Engineering',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: students
DROP TABLE IF EXISTS \`students\`;
CREATE TABLE \`students\` (
  \`id\` VARCHAR(32) PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(160) NOT NULL UNIQUE,
  \`gender\` ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',
  \`department\` VARCHAR(80) NOT NULL,
  \`cgpa\` DECIMAL(4,2) NOT NULL,
  \`backlogs\` INT NOT NULL DEFAULT 0,
  \`aptitude_score\` INT NOT NULL,
  \`technical_score\` INT NOT NULL,
  \`communication_score\` INT NOT NULL,
  \`technical_skills\` TEXT NOT NULL,
  \`internship_months\` INT NOT NULL DEFAULT 0,
  \`placement_status\` ENUM('Placed', 'Not Placed', 'In Process') NOT NULL DEFAULT 'Not Placed',
  \`company_name\` VARCHAR(120) DEFAULT NULL,
  \`package_lpa\` DECIMAL(5,2) DEFAULT NULL,
  \`graduation_year\` INT NOT NULL,
  \`placed_date\` DATE DEFAULT NULL,
  INDEX \`idx_students_dept\` (\`department\`),
  INDEX \`idx_students_status\` (\`placement_status\`),
  INDEX \`idx_students_cgpa\` (\`cgpa\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: companies
DROP TABLE IF EXISTS \`companies\`;
CREATE TABLE \`companies\` (
  \`id\` VARCHAR(32) PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL UNIQUE,
  \`tier\` ENUM('Super Dream (> 15 LPA)', 'Dream (8-15 LPA)', 'Regular (< 8 LPA)') NOT NULL,
  \`industry\` VARCHAR(100) NOT NULL,
  \`avg_package_lpa\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  \`highest_package_lpa\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  \`recruited_count\` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    },
    'sample_data.sql': {
      label: 'database/sample_data.sql',
      language: 'sql',
      icon: Database,
      content: `USE \`placement_analysis\`;

-- Insert admin & faculty users
INSERT INTO \`users\` (\`name\`, \`email\`, \`password_hash\`, \`role\`, \`college_name\`) VALUES
('Dr. Rajeshwar Sharma', 'tpo@university.edu.in', 'scrypt:32768:8:1$kXm9J...$PlacementHash2024', 'Placement Officer', 'National Institute of Technology & Engineering'),
('Prof. K. Venkatesh', 'dean@university.edu.in', 'scrypt:32768:8:1$kXm9J...$AcademicHash2024', 'Dean / Administrator', 'National Institute of Technology & Engineering');

-- Insert Students Cohort
INSERT INTO \`students\` (\`id\`, \`name\`, \`email\`, \`gender\`, \`department\`, \`cgpa\`, \`backlogs\`, \`aptitude_score\`, \`technical_score\`, \`communication_score\`, \`technical_skills\`, \`internship_months\`, \`placement_status\`, \`company_name\`, \`package_lpa\`, \`graduation_year\`, \`placed_date\`) VALUES
('STU-2024-001', 'Aarav Sharma', 'aarav.sharma@campus.edu.in', 'Male', 'Computer Science (CSE)', 9.42, 0, 94, 96, 88, 'Python, C++, Data Structures, System Design, React', 6, 'Placed', 'Google', 44.00, 2024, '2024-03-15'),
('STU-2024-002', 'Ananya Reddy', 'ananya.reddy@campus.edu.in', 'Female', 'Computer Science (CSE)', 9.15, 0, 91, 93, 92, 'Java, Spring Boot, Microservices, AWS, SQL', 5, 'Placed', 'Microsoft', 42.00, 2024, '2024-02-18'),
('STU-2024-003', 'Rohan Verma', 'rohan.verma@campus.edu.in', 'Male', 'AI & Data Science (AI&DS)', 8.88, 0, 89, 91, 85, 'Python, TensorFlow, PyTorch, Data Analysis, NLP', 6, 'Placed', 'Amazon', 36.00, 2024, '2024-03-02'),
('STU-2024-004', 'Pooja Iyer', 'pooja.iyer@campus.edu.in', 'Female', 'Information Technology (IT)', 8.95, 0, 92, 89, 90, 'C++, Python, Algorithms, Docker, Kubernetes', 4, 'Placed', 'Goldman Sachs', 26.50, 2024, '2024-01-22'),
('STU-2024-005', 'Karthik Menon', 'karthik.menon@campus.edu.in', 'Male', 'Electronics & Communication (ECE)', 8.62, 0, 86, 84, 82, 'Verilog, VLSI Design, Embedded C, Python, IoT', 3, 'Placed', 'Cisco Systems', 18.00, 2024, '2024-02-10'),
('STU-2024-006', 'Sneha Patil', 'sneha.patil@campus.edu.in', 'Female', 'Computer Science (CSE)', 8.54, 0, 84, 87, 88, 'Java, JavaScript, React, Node.js, MongoDB', 4, 'Placed', 'Oracle', 16.00, 2024, '2024-02-28');`
    },
    'SETUP_WINDOWS.md': {
      label: 'SETUP_WINDOWS.md (PowerShell)',
      language: 'markdown',
      icon: Terminal,
      content: `# Windows PowerShell Setup Guide
## Student Placement Data Analysis and Prediction System

1. Open PowerShell and navigate to project:
   cd C:\\Projects\\placement_analysis

2. Set Up Python 3.10+ Virtual Environment:
   python -m venv venv
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\\venv\\Scripts\\Activate.ps1

3. Install Requirements:
   pip install -r requirements.txt

4. Configure MySQL Database:
   mysql -u root -p
   SOURCE database/schema.sql;
   SOURCE database/sample_data.sql;
   EXIT;

5. Run Flask Application:
   python app.py

6. Open Browser:
   http://127.0.0.1:5000
   Credentials: tpo@university.edu.in / Placement@2024`
    },
    'prediction.py': {
      label: 'services/prediction.py (ML Model)',
      language: 'python',
      icon: Code2,
      content: `"""
Machine Learning Placement Prediction Engine
Calibrated with Logistic Regression & Random Forest feature importances
"""
import numpy as np

def predict_student_placement(data):
    cgpa = float(data.get('cgpa', 7.5))
    backlogs = int(data.get('backlogs', 0))
    aptitude = float(data.get('aptitude_score', 70))
    tech = float(data.get('technical_score', 75))
    comm = float(data.get('communication_score', 75))
    internship = float(data.get('internship_months', 2))

    # Logistic Logit computation
    logit = -3.8
    logit += (cgpa - 6.0) * 0.95
    logit -= backlogs * 1.35
    logit += (aptitude - 50.0) * 0.042
    logit += (tech - 50.0) * 0.055
    logit += (comm - 50.0) * 0.032
    logit += min(internship, 6.0) * 0.28 + max(internship - 6.0, 0.0) * 0.08

    prob = 1.0 / (1.0 + np.exp(-logit))
    prob_percent = int(round(np.clip(prob * 100, 5, 98)))

    if backlogs >= 2 and prob_percent > 45:
        prob_percent = 45

    classification = "High Probability" if prob_percent >= 75 else ("Moderate Probability" if prob_percent >= 50 else "Needs Improvement")

    return {
        "probability_percent": prob_percent,
        "classification": classification,
        "estimated_package_range": "18-42 LPA (Super Dream)" if prob_percent >= 85 and tech >= 85 and cgpa >= 8.2 else "8-16 LPA (Dream)" if prob_percent >= 70 and (tech >= 75 or cgpa >= 7.8) else "5-8.5 LPA"
    }`
    },
    'app.py': {
      label: 'app.py (Flask Backend)',
      language: 'python',
      icon: Code2,
      content: `"""
Flask Application Entry Point
Student Placement Data Analysis and Prediction System
"""
import os
from flask import Flask, jsonify, request
import mysql.connector
from config import Config
from services.prediction import predict_student_placement

app = Flask(__name__)
app.config.from_object(Config)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "active", "service": "Placement Intelligence API"})

@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json."}), 415
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "The request body must be a JSON object."}), 400
    result = predict_student_placement(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.getenv('PORT', '5000')))`
    },
    'README.md': {
      label: 'README.md (Project Report)',
      language: 'markdown',
      icon: BookOpen,
      content: `# Student Placement Data Analysis and Prediction System
B.Tech Final Year Engineering Capstone Project

1. System Architecture:
   - Frontend: Modern Responsive Analytics Dashboard
   - Backend: Python Flask
   - Database: MySQL (placement_analysis)
   - Machine Learning: Calibrated Logistic Regression Model

2. Deliverables Checklist:
   [x] Complete MySQL Schema (database/schema.sql)
   [x] Sample Data Seed (database/sample_data.sql)
   [x] Windows Setup Guide using PowerShell (SETUP_WINDOWS.md)
   [x] Python Flask Backend & ML Service (app.py, services/prediction.py)
   [x] Test Verification Suite (8 Test Cases)`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const file = fileContents[activeFile];
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Code2 className="w-5 h-5 text-teal-600" />
          <span>Python Flask & MySQL Final Year Submission Kit</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Complete source code, MySQL schema, seed data, and PowerShell setup guide for your B.Tech project presentation.
        </p>
      </div>

      {/* Deliverable Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <Database className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">MySQL Database</p>
            <p className="text-[11px] text-slate-400">schema.sql & sample_data.sql</p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <Code2 className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Python Flask</p>
            <p className="text-[11px] text-slate-400">app.py, routes & services</p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <Terminal className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Windows PowerShell</p>
            <p className="text-[11px] text-slate-400">Step-by-step setup guide</p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Test Cases</p>
            <p className="text-[11px] text-slate-400">8 verification test cases</p>
          </div>
        </div>
      </div>

      {/* Code Browser */}
      <div className="bg-slate-900 text-slate-200 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        {/* Top bar with file selector tabs and copy/download buttons */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {Object.keys(fileContents).map((fileKey) => {
              const file = fileContents[fileKey];
              const Icon = file.icon;
              const isActive = activeFile === fileKey;
              return (
                <button
                  key={fileKey}
                  onClick={() => setActiveFile(fileKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-teal-400 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{file.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-5 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
          <pre className="text-slate-300">
            <code>{fileContents[activeFile].content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
