
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calculator,
  Calendar,
  Clock,
  XCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentSection =
    user?.studentProfile?.section?.name ||
    user?.studentProfile?.section ||
    'Section A';

  const THRESHOLD = 75;

  // Fetch attendance data from MongoDB
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/students/analytics');
        setAnalytics(response.data.analytics);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load attendance data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Manual shortage calculator
  const [calcTotal, setCalcTotal] = useState(20);
  const [calcAttended, setCalcAttended] = useState(10);

  const currentPercentage =
    calcTotal > 0
      ? ((calcAttended / calcTotal) * 100).toFixed(1)
      : '0.0';

  const classesNeeded = Math.max(
    0,
    Math.ceil(3 * calcTotal - 4 * calcAttended)
  );

  const safeBunks =
    Number(currentPercentage) >= THRESHOLD
      ? Math.max(
          0,
          Math.floor((4 * calcAttended - 3 * calcTotal) / 3)
        )
      : 0;

  // Loading state
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600">
        Loading your attendance dashboard...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <h3 className="font-bold">Unable to load dashboard</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Process subjects returned by backend
  const subjects = (analytics?.subjectStats || []).map((subject) => {
    const attended =
      Number(subject.present || 0) +
      Number(subject.late || 0);

    const total = Number(subject.totalClasses || 0);

    return {
      name: subject.subject,
      code: subject.code,
      attended,
      total,
      absent: Number(subject.absent || 0),
      percentage: total > 0
        ? Number(((attended / total) * 100).toFixed(1))
        : null
    };
  });

  const totalLectures = Number(analytics?.totalClasses || 0);
  const totalAttended = Number(analytics?.classesAttended || 0);
  const totalMissed = Number(analytics?.classesMissed || 0);

  const overallPercentage = Number(
    analytics?.overallPercentage || 0
  ).toFixed(1);

  const hasAttendance = totalLectures > 0;

  // Only subjects with recorded classes are checked against 75%
  const recordedSubjects = subjects.filter(
    (subject) => subject.total > 0
  );

  const unmarkedSubjects = subjects.filter(
    (subject) => subject.total === 0
  );

  const belowThresholdSubjects = recordedSubjects.filter(
    (subject) => subject.percentage < THRESHOLD
  );

  const isEligible =
    recordedSubjects.length > 0 &&
    belowThresholdSubjects.length === 0;

  return (
    <div className="space-y-6">

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-950/20 border border-purple-800/40">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                VIGNAN UNIVERSITY
              </span>

              <span className="text-xs text-purple-200 font-semibold">
                Dept. of AIML • 3rd Year
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome, {user?.name || 'AIML Student'}!
            </h2>

            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Reg No: {user?.studentProfile?.rollNumber || 'Not available'}
              {' '}• Branch: Artificial Intelligence & Machine Learning
            </p>

            <p className="text-sm font-bold text-white mt-2">
              Your Section: {studentSection}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm px-5 py-4 rounded-xl border border-white/20 text-center shrink-0">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-purple-200">
              Recorded Attendance
            </span>

            <span className="text-2xl font-black text-white">
              {overallPercentage}%
            </span>

            <span className="block text-[10px] text-purple-200 mt-1">
              Based on marked classes
            </span>
          </div>

        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Lectures */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Total Lectures
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {totalLectures}
          </p>

          <span className="text-xs text-slate-500 mt-0.5 block">
            Across {recordedSubjects.length} subjects with attendance
          </span>
        </div>

        {/* Classes Attended */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Classes Attended
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {totalAttended}
          </p>

          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">
            Present and late classes
          </span>
        </div>

        {/* Classes Missed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Classes Missed
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-800 mt-2">
            {totalMissed}
          </p>

          <span className="text-xs text-amber-600 font-medium mt-0.5 block">
            Total absences recorded
          </span>
        </div>

        {/* Exam Eligibility */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Exam Eligibility
            </span>

            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              !hasAttendance
                ? 'bg-slate-100 text-slate-500'
                : isEligible
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
            }`}>
              {!hasAttendance
                ? <Clock className="w-4 h-4" />
                : isEligible
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <XCircle className="w-4 h-4" />}
            </div>
          </div>

          <p className={`text-xl font-bold mt-2 ${
            !hasAttendance
              ? 'text-slate-500'
              : isEligible
                ? 'text-emerald-700'
                : 'text-red-700'
          }`}>
            {!hasAttendance
              ? 'No Data'
              : isEligible
                ? 'Eligible'
                : 'Not Eligible'}
          </p>

          <span className="text-xs text-slate-500 mt-0.5 block">
            {!hasAttendance
              ? 'Attendance not recorded yet'
              : isEligible
                ? `${recordedSubjects.length} recorded subject(s) meet 75%`
                : `${belowThresholdSubjects.length} recorded subject(s) below 75%`}
          </span>
        </div>

      </div>

      {/* Attendance Advisory */}
      {hasAttendance && belowThresholdSubjects.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3.5">

          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Attendance Advisory (75% Minimum Threshold)
            </h3>

            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              The following recorded subject(s) are below the 75% threshold:
            </p>

            <ul className="mt-2 space-y-1">
              {belowThresholdSubjects.map((subject) => (
                <li
                  key={subject.code}
                  className="text-xs font-semibold text-amber-900"
                >
                  {subject.name} ({subject.code}): {subject.percentage}%
                </li>
              ))}
            </ul>

            <p className="text-xs text-amber-800 mt-2">
              Attend upcoming classes regularly to improve your attendance.
            </p>
          </div>

        </div>
      )}

      {/* Subject Analytics and Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Subject Analytics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Enrolled Subjects
              </h3>
              <p className="text-xs text-slate-500">
                Attendance status by subject
              </p>
            </div>

            <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
              {subjects.length} Enrolled Subjects
            </span>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">
                No subjects found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Your enrolled subjects will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {subjects.map((sub) => {
                const notMarked = sub.total === 0;
                const isBelow =
                  !notMarked && sub.percentage < THRESHOLD;

                return (
                  <div
                    key={sub.code}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                  >

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                          <BookOpen className="w-4 h-4 text-brand-600" />
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-800">
                            {sub.name}
                          </h4>
                          <span className="text-[11px] font-medium text-slate-400 font-mono">
                            {sub.code}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-sm font-extrabold ${
                          notMarked
                            ? 'text-slate-500'
                            : isBelow
                              ? 'text-red-600'
                              : 'text-emerald-600'
                        }`}>
                          {notMarked
                            ? 'Not Yet Marked'
                            : `${sub.percentage}%`}
                        </span>

                        <span className="text-[11px] text-slate-500 block">
                          {notMarked
                            ? 'No attendance recorded'
                            : `${sub.attended}/${sub.total} classes`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          notMarked
                            ? 'bg-slate-300'
                            : isBelow
                              ? 'bg-red-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(sub.percentage || 0, 100)}%`
                        }}
                      />
                    </div>

                    {notMarked && (
                      <div className="mt-2 text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Waiting for faculty to mark attendance.
                        </span>
                      </div>
                    )}

                    {isBelow && (
                      <div className="mt-2 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>
                          Below 75% requirement. Attend upcoming classes regularly.
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

          {unmarkedSubjects.length > 0 && (
            <p className="text-[11px] text-slate-500 mt-4">
              {unmarkedSubjects.length} subject(s) are waiting for attendance records.
            </p>
          )}
        </div>

        {/* Manual Shortage Calculator */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                <Calculator className="w-4 h-4" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Shortage Calculator
                </h3>
                <p className="text-[11px] text-slate-500">
                  Manual attendance calculation
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Enter your own attendance figures. This calculator is independent of your recorded subject attendance.
            </p>

            <div className="space-y-3 mt-4">

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Classes Attended (A)
                </label>

                <input
                  type="number"
                  min="0"
                  max={calcTotal}
                  value={calcAttended}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCalcAttended(
                      value === ''
                        ? 0
                        : Math.min(
                            calcTotal,
                            Math.max(0, Number(value))
                          )
                    );
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Total Classes Conducted (T)
                </label>

                <input
                  type="number"
                  min="1"
                  value={calcTotal}
                  onChange={(e) => {
                    const total = Math.max(1, Number(e.target.value) || 1);
                    setCalcTotal(total);
                    setCalcAttended((previous) =>
                      Math.min(previous, total)
                    );
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">

              <span className="text-xs text-slate-500 font-medium">
                Calculated Percentage
              </span>

              <div className={`text-2xl font-black mt-0.5 ${
                Number(currentPercentage) < THRESHOLD
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }`}>
                {currentPercentage}%
              </div>

              {Number(currentPercentage) < THRESHOLD ? (
                <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 text-left">
                  <span className="font-bold block">
                    Shortage Detected!
                  </span>
                  You must attend the next <strong>{classesNeeded}</strong> consecutive classes without missing any to reach 75%.
                </div>
              ) : (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 text-left">
                  <span className="font-bold block">
                    Good Standing!
                  </span>
                  You can safely miss up to <strong>{safeBunks}</strong> classes without dropping below 75%.
                </div>
              )}

            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-4">
            Example: 10 attended out of 20 requires 20 consecutive classes to reach 75%.
          </p>

        </div>
      </div>

      <p className="text-[10px] text-slate-400 text-center">
        Attendance statistics are fetched from recorded MongoDB attendance data.
      </p>

    </div>
  );
};

export default StudentDashboard;
