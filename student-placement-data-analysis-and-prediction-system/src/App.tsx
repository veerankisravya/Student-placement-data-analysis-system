/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StudentModal } from './components/StudentModal';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StudentManagement } from './pages/StudentManagement';
import { PerformanceAnalysis } from './pages/PerformanceAnalysis';
import { PlacementPrediction } from './pages/PlacementPrediction';
import { CompanyAnalytics } from './pages/CompanyAnalytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { SubmissionKit } from './pages/SubmissionKit';

import { Student, Company, User } from './types';
import { storage } from './services/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storage.getTheme());

  // Data states
  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [companies, setCompanies] = useState<Company[]>(() => storage.getCompanies());

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  // Synchronize theme with DOM
  useEffect(() => {
    storage.setTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    storage.setTheme(nextTheme);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the placement portal?')) {
      setCurrentUser(null);
      storage.setCurrentUser(null);
    }
  };

  const handleSaveStudent = (data: Partial<Student>) => {
    if (data.id) {
      // Edit
      storage.updateStudent(data as Student);
      setStudents(storage.getStudents());
      if (selectedStudentForProfile?.id === data.id) {
        setSelectedStudentForProfile(data as Student);
      }
    } else {
      // Add new
      const newCreated = storage.addStudent(data as Omit<Student, 'id'>);
      setStudents(storage.getStudents());
      // Prompt to view
      setSelectedStudentForProfile(newCreated);
    }
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    storage.deleteStudent(id);
    setStudents(storage.getStudents());
    if (selectedStudentForProfile?.id === id) {
      setSelectedStudentForProfile(null);
    }
  };

  const handleResetData = () => {
    storage.resetData();
    setStudents(storage.getStudents());
    setCompanies(storage.getCompanies());
    setSelectedStudentForProfile(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    storage.setCurrentUser(updatedUser);
  };

  // If not logged in, render authentication view
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentUser={currentUser}
          activeTab={activeTab}
          onOpenAddModal={() => {
            setEditingStudent(null);
            setIsAddModalOpen(true);
          }}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          students={students}
          onSelectStudent={(student) => setSelectedStudentForProfile(student)}
        />

        <main className="flex-1 pb-16">
          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              companies={companies}
              onOpenAddModal={() => {
                setEditingStudent(null);
                setIsAddModalOpen(true);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectStudent={(student) => setSelectedStudentForProfile(student)}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement
              students={students}
              onOpenAddModal={() => {
                setEditingStudent(null);
                setIsAddModalOpen(true);
              }}
              onEditStudent={(student) => {
                setEditingStudent(student);
                setIsAddModalOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onSelectStudent={(student) => setSelectedStudentForProfile(student)}
              onReloadData={() => setStudents(storage.getStudents())}
            />
          )}

          {activeTab === 'analysis' && (
            <PerformanceAnalysis students={students} />
          )}

          {activeTab === 'prediction' && (
            <PlacementPrediction />
          )}

          {activeTab === 'companies' && (
            <CompanyAnalytics companies={companies} students={students} />
          )}

          {activeTab === 'reports' && (
            <Reports students={students} companies={companies} />
          )}

          {activeTab === 'submission-kit' && (
            <SubmissionKit />
          )}

          {activeTab === 'settings' && (
            <Settings
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onLogout={handleLogout}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Student Add / Edit Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onEdit={(student) => {
          setEditingStudent(student);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}
