import React, { useState } from 'react';
import {
  Landmark,
  Save,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Award,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';

const InstituteProfile = () => {
  const [minThreshold, setMinThreshold] = useState(75);
  const [medicalThreshold, setMedicalThreshold] = useState(65);
  const [autoNotify, setAutoNotify] = useState(true);
  const [academicTerm, setAcademicTerm] = useState('2026-2027 Even Semester');
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePolicy = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-950/20 border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                VIGNAN UNIVERSITY
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                Institutional Profile &amp; Regulatory Policies
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Institute Profile &amp; Attendance Policies
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Vignan's Foundation for Science, Technology &amp; Research (Deemed to be University).
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-bold text-xs border border-white/20">
            <Award className="w-4 h-4 text-purple-200" />
            <span>NAAC 'A+' Grade</span>
          </span>
        </div>
      </div>

      {/* Save Success Banner */}
      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Institutional attendance policies updated and applied campus-wide!</span>
        </div>
      )}

      {/* University Metadata Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
              Deemed to be University
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Vignan's Foundation for Science, Technology &amp; Research
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Established under Section 3 of UGC Act 1956 &bull; Category-1 Deemed University
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Vadlamudi, Chebrolu Mandal, Guntur District, Andhra Pradesh - 522213</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Chancellor</span>
            <strong className="text-slate-800 font-bold">Dr. Lavu Rathaiah</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Vice Chancellor</span>
            <strong className="text-slate-800 font-bold">Dr. P. Nagabhushan</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Accreditation</span>
            <strong className="text-emerald-700 font-bold">NAAC A+ (CGPA 3.49)</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Official Portal</span>
            <a
              href="https://vignan.ac.in"
              target="_blank"
              rel="noreferrer"
              className="text-brand-700 font-bold flex items-center gap-1 hover:underline"
            >
              <span>vignan.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Attendance Regulatory Policy Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
          <div className="p-2 bg-purple-50 text-brand-700 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Institutional Attendance Regulations
            </h3>
            <p className="text-xs text-slate-500">
              Enforce mandatory minimum lecture attendance thresholds and shortage triggers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePolicy} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Mandatory Exam Eligibility Threshold (%)
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                Students scoring below this percentage receive immediate low-attendance alerts and shortage warnings.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-sm font-bold text-brand-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-xs font-semibold text-slate-600">% Attendance (Standard: 75%)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Medical Condonation Threshold (%)
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                Students with certified medical excuses can be condoned by the Dean down to this floor.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="40"
                  max="74"
                  value={medicalThreshold}
                  onChange={(e) => setMedicalThreshold(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-sm font-bold text-brand-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-xs font-semibold text-slate-600">% Attendance (Standard: 65%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Current Academic Term
              </label>
              <input
                type="text"
                value={academicTerm}
                onChange={(e) => setAcademicTerm(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 mt-1">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Automated Below 75% Notifications
                </span>
                <span className="text-[11px] text-slate-500">
                  Sends in-app shortage warnings when attendance falls below threshold.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoNotify}
                onChange={(e) => setAutoNotify(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Policy Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstituteProfile;
