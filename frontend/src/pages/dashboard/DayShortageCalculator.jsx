
import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  CalendarCheck
} from 'lucide-react';

function DayShortageCalculator() {
  const [conducted, setConducted] = useState('');
  const [attended, setAttended] = useState('');
  const [result, setResult] = useState(null);

  const calculateAttendance = () => {
    const total = Number(conducted);
    const present = Number(attended);

    if (
      conducted === '' ||
      attended === '' ||
      !Number.isInteger(total) ||
      !Number.isInteger(present) ||
      total <= 0 ||
      present < 0 ||
      present > total
    ) {
      setResult({
        error: 'Enter valid class counts. Attended cannot exceed conducted.'
      });
      return;
    }

    const percentage = (present / total) * 100;

    // Classes needed to reach 75%
    const required = Math.max(
      0,
      Math.ceil((0.75 * total - present) / 0.25)
    );

    // Maximum classes that can be missed while staying at 75%
    const safeBunks = percentage >= 75
      ? Math.max(0, Math.floor((present - 0.75 * total) / 0.75))
      : 0;

    setResult({
      percentage: percentage.toFixed(2),
      required,
      safeBunks,
      eligible: percentage >= 75
    });
  };

  const resetCalculator = () => {
    setConducted('');
    setAttended('');
    setResult(null);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              Day Shortage Calculator
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Calculate your attendance percentage and classes needed to reach 75%.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="bg-white shadow rounded-xl p-6 max-w-xl border border-gray-100">

        <div className="mb-5">
          <label className="block font-semibold text-gray-700 mb-2">
            Total Classes Conducted
          </label>

          <input
            type="number"
            min="1"
            value={conducted}
            onChange={(e) => {
              setConducted(e.target.value);
              setResult(null);
            }}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter total classes"
          />
        </div>

        <div className="mb-5">
          <label className="block font-semibold text-gray-700 mb-2">
            Classes Attended
          </label>

          <input
            type="number"
            min="0"
            value={attended}
            onChange={(e) => {
              setAttended(e.target.value);
              setResult(null);
            }}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter attended classes"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculateAttendance}
            className="flex-1 bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Calculate
          </button>

          <button
            onClick={resetCalculator}
            className="px-5 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6">

            {result.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">
                  {result.error}
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Percentage */}
                <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl text-center">
                  <p className="text-sm text-gray-600 font-medium">
                    Your Attendance Percentage
                  </p>

                  <p className={`text-4xl font-bold mt-2 ${
                    result.eligible
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {result.percentage}%
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    Minimum required attendance: 75%
                  </p>
                </div>

                {/* Eligibility */}
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  result.eligible
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {result.eligible ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  )}

                  <div>
                    <p className={`font-semibold ${
                      result.eligible
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {result.eligible
                        ? 'You meet the 75% attendance requirement!'
                        : 'Your attendance is below 75%.'}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {result.eligible
                        ? 'You are currently above the minimum attendance threshold.'
                        : 'You need to attend consecutive upcoming classes to improve your attendance.'}
                    </p>
                  </div>
                </div>

                {/* Classes Needed */}
                {!result.eligible && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <TrendingUp className="w-5 h-5" />
                      <p className="font-semibold">
                        Classes Required
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-orange-700 mt-2">
                      {result.required} Classes
                    </p>

                    <p className="text-sm text-orange-800 mt-1">
                      Attend the next {result.required} consecutive classes without missing any to reach at least 75%.
                    </p>
                  </div>
                )}

                {/* Safe Bunks */}
                {result.eligible && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CalendarCheck className="w-5 h-5" />
                      <p className="font-semibold">
                        Safe Bunk Calculation
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-green-700 mt-2">
                      {result.safeBunks} Classes
                    </p>

                    <p className="text-sm text-green-800 mt-1">
                      You can miss up to {result.safeBunks} upcoming classes and remain at or above 75%, assuming every other class is attended.
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DayShortageCalculator;
