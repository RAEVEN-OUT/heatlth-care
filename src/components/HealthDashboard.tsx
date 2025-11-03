'use client';

import React, { useState } from 'react';
import { Heart, Activity, Droplet, Wind, Calendar } from 'lucide-react';
import type { Vitals, HealthHistory } from '../../types';

export default function HealthDashboard() {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: { value: 0, unit: 'bpm', status: 'normal' },
    bloodPressure: { systolic: 0, diastolic: 0, status: 'normal' },
    oxygenLevel: { value: 0, unit: '%', status: 'normal' },
    temperature: { value: 0, unit: '°F', status: 'normal' },
  });

  const [history, setHistory] = useState<HealthHistory[]>([]);

  const addVital = (type: string, value: string) => {
    const newEntry: HealthHistory = {
      id: Date.now(),
      type,
      value,
      timestamp: new Date().toLocaleString(),
    };
    setHistory([newEntry, ...history.slice(0, 9)]);
  };

  const updateHeartRate = (value: number) => {
    const status: 'low' | 'normal' | 'high' =
      value < 60 ? 'low' : value > 100 ? 'high' : 'normal';
    setVitals((prev) => ({
      ...prev,
      heartRate: { value, unit: 'bpm', status },
    }));
    addVital('Heart Rate', `${value} bpm`);
  };

  const updateBloodPressure = (systolic: number, diastolic: number) => {
    const status: 'low' | 'normal' | 'high' =
      systolic > 140 || diastolic > 90
        ? 'high'
        : systolic < 90 || diastolic < 60
        ? 'low'
        : 'normal';
    setVitals((prev) => ({
      ...prev,
      bloodPressure: { systolic, diastolic, status },
    }));
    addVital('Blood Pressure', `${systolic}/${diastolic} mmHg`);
  };

  const updateOxygenLevel = (value: number) => {
    const status: 'low' | 'normal' = value < 95 ? 'low' : 'normal';
    setVitals((prev) => ({
      ...prev,
      oxygenLevel: { value, unit: '%', status },
    }));
    addVital('Oxygen Level', `${value}%`);
  };

  const updateTemperature = (value: number) => {
    const status: 'low' | 'normal' | 'high' =
      value > 100.4 ? 'high' : value < 97 ? 'low' : 'normal';
    setVitals((prev) => ({
      ...prev,
      temperature: { value, unit: '°F', status },
    }));
    addVital('Temperature', `${value}°F`);
  };

  const getStatusColor = (status: 'normal' | 'low' | 'high'): string => {
    return status === 'normal'
      ? 'var(--color-success)'
      : status === 'high'
      ? 'var(--color-error)'
      : 'var(--color-warning)';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Activity size={32} className="text-color-primary" />
        Health Vitals Dashboard
      </h1>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Heart Rate */}
        <div className="card" style={{ background: 'var(--color-bg-1)' }}>
          <div className="card__body">
            <div className="flex items-center justify-between mb-3">
              <Heart size={24} style={{ color: getStatusColor(vitals.heartRate.status) }} />
              <span
                className={`status status--${
                  vitals.heartRate.status === 'normal' ? 'success' : 'error'
                }`}
              >
                {vitals.heartRate.status}
              </span>
            </div>
            <h3 className="text-sm font-medium text-color-text-secondary mb-1">
              Heart Rate
            </h3>
            <p className="text-2xl font-bold">
              {vitals.heartRate.value} <span className="text-sm">bpm</span>
            </p>
            <input
              type="number"
              className="form-control mt-3"
              placeholder="Enter BPM"
              onBlur={(e) =>
                e.target.value && updateHeartRate(Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="card" style={{ background: 'var(--color-bg-2)' }}>
          <div className="card__body">
            <div className="flex items-center justify-between mb-3">
              <Droplet
                size={24}
                style={{ color: getStatusColor(vitals.bloodPressure.status) }}
              />
              <span
                className={`status status--${
                  vitals.bloodPressure.status === 'normal' ? 'success' : 'error'
                }`}
              >
                {vitals.bloodPressure.status}
              </span>
            </div>
            <h3 className="text-sm font-medium text-color-text-secondary mb-1">
              Blood Pressure
            </h3>
            <p className="text-2xl font-bold">
              {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
              <span className="text-sm ml-1">mmHg</span>
            </p>
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                className="form-control"
                placeholder="Sys"
                onBlur={(e) => {
                  if (e.target.value) {
                    const systolic = Number(e.target.value);
                    const diastolic = vitals.bloodPressure.diastolic || 80;
                    updateBloodPressure(systolic, diastolic);
                  }
                }}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Dia"
                onBlur={(e) => {
                  if (e.target.value) {
                    const systolic = vitals.bloodPressure.systolic || 120;
                    const diastolic = Number(e.target.value);
                    updateBloodPressure(systolic, diastolic);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Oxygen Level */}
        <div className="card" style={{ background: 'var(--color-bg-3)' }}>
          <div className="card__body">
            <div className="flex items-center justify-between mb-3">
              <Wind size={24} style={{ color: getStatusColor(vitals.oxygenLevel.status) }} />
              <span
                className={`status status--${
                  vitals.oxygenLevel.status === 'normal' ? 'success' : 'warning'
                }`}
              >
                {vitals.oxygenLevel.status}
              </span>
            </div>
            <h3 className="text-sm font-medium text-color-text-secondary mb-1">
              Oxygen Level
            </h3>
            <p className="text-2xl font-bold">{vitals.oxygenLevel.value}%</p>
            <input
              type="number"
              className="form-control mt-3"
              placeholder="Enter SpO2%"
              min="0"
              max="100"
              onBlur={(e) =>
                e.target.value && updateOxygenLevel(Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="card" style={{ background: 'var(--color-bg-4)' }}>
          <div className="card__body">
            <div className="flex items-center justify-between mb-3">
              <Activity
                size={24}
                style={{ color: getStatusColor(vitals.temperature.status) }}
              />
              <span
                className={`status status--${
                  vitals.temperature.status === 'normal' ? 'success' : 'error'
                }`}
              >
                {vitals.temperature.status}
              </span>
            </div>
            <h3 className="text-sm font-medium text-color-text-secondary mb-1">
              Temperature
            </h3>
            <p className="text-2xl font-bold">{vitals.temperature.value}°F</p>
            <input
              type="number"
              className="form-control mt-3"
              placeholder="Enter temp"
              step="0.1"
              onBlur={(e) =>
                e.target.value && updateTemperature(Number(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="card">
        <div className="card__header">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar size={20} />
            Recent Activity
          </h2>
        </div>
        <div className="card__body">
          {history.length === 0 ? (
            <p className="text-color-text-secondary text-center py-8">
              No vitals recorded yet. Start by entering your health data above.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'var(--color-secondary)' }}
                >
                  <div>
                    <span className="font-medium">{entry.type}</span>
                    <span className="text-color-text-secondary text-sm ml-2">
                      {entry.value}
                    </span>
                  </div>
                  <span className="text-xs text-color-text-secondary">
                    {entry.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
