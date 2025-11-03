'use client';

import React, { useState } from 'react';
import { Search, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { DrugInfo } from "../../types";

export default function DrugChecker() {
  const [drugName, setDrugName] = useState<string>('');
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const searchDrug = async () => {
    if (!drugName.trim()) {
      setError('Please enter a drug name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/drugs?name=${encodeURIComponent(drugName)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch drug information');
      }

      setDrugInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDrugInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchDrug();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card">
        <div className="card__header">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            💊 Drug Information Checker
          </h1>
          <p className="text-sm text-color-text-secondary mt-2">
            Powered by openFDA Database
          </p>
        </div>

        <div className="card__body">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              className="form-control flex-1"
              placeholder="Enter drug name (e.g., Aspirin, Lipitor)"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn--primary flex items-center gap-2"
              onClick={searchDrug}
              disabled={loading}
            >
              <Search size={20} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="status status--error mb-4 flex items-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* Drug Information */}
          {drugInfo && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="card" style={{ background: 'var(--color-bg-1)' }}>
                <div className="card__body">
                  <h2 className="text-xl font-semibold mb-2">
                    {drugInfo.brandName}
                  </h2>
                  <p className="text-color-text-secondary">
                    Generic: {drugInfo.genericName}
                  </p>
                </div>
              </div>

              {/* Purpose */}
              <div className="card">
                <div className="card__body">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info size={18} className="text-color-info" />
                    Purpose
                  </h3>
                  <p className="text-sm">{drugInfo.purpose}</p>
                </div>
              </div>

              {/* Warnings */}
              <div className="card" style={{ borderColor: 'var(--color-warning)' }}>
                <div className="card__body">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-color-warning" />
                    Warnings
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {drugInfo.warnings.substring(0, 500)}...
                  </p>
                </div>
              </div>

              {/* Dosage */}
              <div className="card">
                <div className="card__body">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle size={18} className="text-color-success" />
                    Dosage & Administration
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {drugInfo.dosage.substring(0, 400)}...
                  </p>
                </div>
              </div>

              {/* Interactions */}
              <div className="card" style={{ borderColor: 'var(--color-error)' }}>
                <div className="card__body">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-color-error" />
                    Drug Interactions
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {drugInfo.interactions.substring(0, 400)}...
                  </p>
                </div>
              </div>

              {/* Side Effects */}
              <div className="card">
                <div className="card__body">
                  <h3 className="font-semibold mb-2">Adverse Reactions</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {drugInfo.sideEffects.substring(0, 400)}...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
