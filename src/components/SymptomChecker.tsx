'use client';

import React, { useState } from 'react';
import { Activity, AlertTriangle, Info } from 'lucide-react';
import type { DiagnosisResult } from '../../types';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [results, setResults] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const analyzeSymptoms = async () => {
    if (!symptoms.trim() || !age) {
      setError('Please enter symptoms and age');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, age, gender }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card">
        <div className="card__header" style={{ background: 'var(--color-bg-4)' }}>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity size={32} />
            AI Symptom Checker
          </h1>
          <p className="text-sm text-color-text-secondary mt-2">
            Powered by Infermedica Medical AI
          </p>
        </div>

        <div className="card__body">
          <div className="status status--warning mb-6 flex items-start gap-2">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Medical Disclaimer:</strong> This tool provides general
              information only and is not a substitute for professional medical
              advice. Please consult a healthcare provider for proper diagnosis.
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4 mb-6">
            <div className="form-group">
              <label className="form-label">Describe Your Symptoms</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Example: I have a headache, fever, and sore throat for 2 days"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="form-group flex-1">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <button
              className="btn btn--primary btn--full-width"
              onClick={analyzeSymptoms}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>

          {error && <div className="status status--error mb-4">{error}</div>}

          {/* Results */}
          {results && results.conditions && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Possible Conditions</h2>
              {results.conditions.slice(0, 5).map((condition, index) => (
                <div
                  key={index}
                  className="card"
                  style={{ background: 'var(--color-bg-5)' }}
                >
                  <div className="card__body">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{condition.common_name}</h3>
                      <span className="status status--info">
                        {Math.round(condition.probability * 100)}% match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${condition.probability * 100}%`,
                          background: 'var(--color-primary)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="card" style={{ borderColor: 'var(--color-info)' }}>
                <div className="card__body">
                  <div className="flex items-start gap-2">
                    <Info size={20} className="text-color-info flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <strong>Next Steps:</strong> Based on these results, we
                      recommend consulting with a healthcare professional for proper
                      diagnosis and treatment. Book an appointment through our
                      platform for personalized care.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
