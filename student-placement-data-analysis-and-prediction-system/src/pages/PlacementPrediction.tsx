import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Sliders,
  Award
} from 'lucide-react';
import { Department, PlacementPredictionInput } from '../types';
import { predictPlacement } from '../services/mlModel';

export const PlacementPrediction: React.FC = () => {
  const [formData, setFormData] = useState<PlacementPredictionInput>({
    cgpa: 8.25,
    backlogs: 0,
    aptitudeScore: 82,
    technicalScore: 85,
    communicationScore: 78,
    internshipMonths: 4,
    department: 'Computer Science (CSE)',
  });

  const prediction = predictPlacement(formData);

  // Preset profiles for instant testing & evaluation
  const loadPreset = (preset: 'tier1' | 'average' | 'atRisk') => {
    if (preset === 'tier1') {
      setFormData({
        cgpa: 9.35,
        backlogs: 0,
        aptitudeScore: 94,
        technicalScore: 96,
        communicationScore: 90,
        internshipMonths: 6,
        department: 'Computer Science (CSE)',
      });
    } else if (preset === 'average') {
      setFormData({
        cgpa: 7.45,
        backlogs: 0,
        aptitudeScore: 72,
        technicalScore: 74,
        communicationScore: 76,
        internshipMonths: 2,
        department: 'Electronics & Communication (ECE)',
      });
    } else {
      setFormData({
        cgpa: 6.35,
        backlogs: 2,
        aptitudeScore: 58,
        technicalScore: 62,
        communicationScore: 65,
        internshipMonths: 0,
        department: 'Mechanical Engineering (ME)',
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-teal-600" />
            <span>Placement Probability Prediction System</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calibrated Machine Learning regression model evaluating candidate readiness and package tier.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Evaluation Presets:</span>
          <button
            onClick={() => loadPreset('tier1')}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100"
          >
            Tier-1 High Achiever
          </button>
          <button
            onClick={() => loadPreset('average')}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200/60"
          >
            Average Profile
          </button>
          <button
            onClick={() => loadPreset('atRisk')}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100"
          >
            At-Risk Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Candidate Input Parameters</span>
            </h3>
            <span className="text-[11px] text-slate-400">Interactive Model</span>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Engineering Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Computer Science (CSE)">Computer Science (CSE)</option>
              <option value="AI & Data Science (AI&DS)">AI & Data Science (AI&DS)</option>
              <option value="Information Technology (IT)">Information Technology (IT)</option>
              <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
              <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
              <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
            </select>
          </div>

          {/* CGPA Slider & Number Input */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Cumulative GPA (CGPA)
              </label>
              <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formData.cgpa.toFixed(2)} / 10.0
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5.0 (Min)</span>
              <span>7.5 (Avg Tier-1 Cutoff)</span>
              <span>10.0 (Max)</span>
            </div>
          </div>

          {/* Active Backlogs */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Active Standing Backlogs
              </label>
              <span className={`font-bold tabular-nums ${formData.backlogs > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {formData.backlogs} {formData.backlogs === 1 ? 'Backlog' : 'Backlogs'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, backlogs: num })}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    formData.backlogs === num
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Skills Assessment Score */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Technical Assessment Score
              </label>
              <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formData.technicalScore}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={formData.technicalScore}
              onChange={(e) => setFormData({ ...formData, technicalScore: parseInt(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Quantitative & Aptitude Score */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Quantitative Aptitude Score
              </label>
              <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formData.aptitudeScore}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={formData.aptitudeScore}
              onChange={(e) => setFormData({ ...formData, aptitudeScore: parseInt(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Communication Score */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Communication & Soft Skills Score
              </label>
              <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formData.communicationScore}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={formData.communicationScore}
              onChange={(e) => setFormData({ ...formData, communicationScore: parseInt(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Internship Months */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Internship Experience
              </label>
              <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {formData.internshipMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={formData.internshipMonths}
              onChange={(e) => setFormData({ ...formData, internshipMonths: parseInt(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Prediction Outcomes & Recommendations */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Prediction Score Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Estimated Placement Probability
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                    {prediction.probabilityPercent}%
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      prediction.placementClassification === 'High Probability'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : prediction.placementClassification === 'Moderate Probability'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {prediction.placementClassification}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Forecasted Compensation Bracket:</span>
                  <strong className="text-slate-900 dark:text-slate-100">
                    {prediction.estimatedPackageRange}
                  </strong>
                </div>
              </div>

              {/* Progress Gauge Ring */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={
                      prediction.probabilityPercent >= 75
                        ? '#0d9488'
                        : prediction.probabilityPercent >= 50
                        ? '#0284c7'
                        : '#f43f5e'
                    }
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - prediction.probabilityPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-slate-400">Readiness</span>
                  <span className="text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {prediction.probabilityPercent}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Factor Impact Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Factor Impact Breakdown
            </h3>
            <div className="space-y-3">
              {prediction.topContributingFactors.map((fac) => (
                <div
                  key={fac.factor}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex items-start gap-3"
                >
                  <div className="mt-0.5 shrink-0">
                    {fac.impact === 'positive' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {fac.impact === 'neutral' && (
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                    )}
                    {fac.impact === 'negative' && (
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {fac.factor}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          fac.impact === 'positive'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : fac.impact === 'negative'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {fac.impact} contribution
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                      {fac.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Preparation Recommendations */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 mb-3 text-teal-700 dark:text-teal-300">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold">
                Tailored Candidate Action Plan
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {prediction.tailoredRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Academic Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Statistical Advisory & Disclaimer:</strong> The placement readiness probability and salary package estimates displayed are statistical forecasts generated from historical recruitment parameters. They do not constitute a contractual job guarantee and must not be used as the sole determinant for recruitment or academic screening decisions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
