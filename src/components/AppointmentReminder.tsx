'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, Mail, MessageSquare, Plus, Trash2 } from 'lucide-react';
import type { Appointment } from '../../types';

export default function AppointmentReminder() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'General Checkup',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [appointments]);

  const checkReminders = () => {
    const now = new Date();
    appointments.forEach((apt) => {
      const aptDateTime = new Date(`${apt.date}T${apt.time}`);
      const timeDiff = aptDateTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 23.5 && hoursDiff < 24.5 && !apt.reminder24h) {
        sendReminder(apt, '24 hours');
        updateAppointmentReminder(apt.id, 'reminder24h');
      }

      if (hoursDiff > 0.5 && hoursDiff < 1.5 && !apt.reminder1h) {
        sendReminder(apt, '1 hour');
        updateAppointmentReminder(apt.id, 'reminder1h');
      }
    });
  };

  const sendReminder = (apt: Appointment, timeframe: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Appointment Reminder', {
        body: `Your appointment with Dr. ${apt.doctorName} is in ${timeframe}`,
        icon: '🏥',
      });
    }

    console.log(`Reminder sent for ${apt.patientName}:`, {
      timeframe,
      phone: apt.phone,
      email: apt.email,
    });
  };

  const updateAppointmentReminder = (id: number, field: 'reminder24h' | 'reminder1h') => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, [field]: true } : apt))
    );
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const addAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
      alert('Please fill in required fields');
      return;
    }

    const appointment: Appointment = {
      id: Date.now(),
      ...newAppointment,
      reminder24h: false,
      reminder1h: false,
      createdAt: new Date().toISOString(),
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: 'General Checkup',
      phone: '',
      email: '',
    });

    requestNotificationPermission();
  };

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const getAppointmentStatus = (
    date: string,
    time: string
  ): { status: string; color: string } => {
    const aptDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = aptDateTime.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (diff < 0) return { status: 'Completed', color: 'var(--color-text-secondary)' };
    if (hours < 1) return { status: 'Starting Soon', color: 'var(--color-error)' };
    if (hours < 24) return { status: 'Today', color: 'var(--color-warning)' };
    return { status: 'Upcoming', color: 'var(--color-success)' };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Bell size={32} className="text-color-primary" />
        Smart Appointment Reminders
      </h1>

      {/* Add Appointment Form */}
      <div className="card mb-8" style={{ background: 'var(--color-bg-1)' }}>
        <div className="card__header">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus size={20} />
            Schedule New Appointment
          </h2>
        </div>
        <div className="card__body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Patient Name *</label>
              <input
                type="text"
                className="form-control"
                value={newAppointment.patientName}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, patientName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Doctor Name</label>
              <input
                type="text"
                className="form-control"
                value={newAppointment.doctorName}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, doctorName: e.target.value })
                }
                placeholder="Dr. Smith"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time *</label>
              <input
                type="time"
                className="form-control"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, time: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Appointment Type</label>
              <select
                className="form-control"
                value={newAppointment.type}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, type: e.target.value })
                }
              >
                <option>General Checkup</option>
                <option>Follow-up</option>
                <option>Consultation</option>
                <option>Emergency</option>
                <option>Lab Test</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={newAppointment.phone}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={newAppointment.email}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, email: e.target.value })
                }
                placeholder="patient@example.com"
              />
            </div>
          </div>

          <button className="btn btn--primary btn--full-width" onClick={addAppointment}>
            <Plus size={18} className="inline mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        <div className="card__header">
          <h2 className="text-xl font-semibold">
            Scheduled Appointments ({appointments.length})
          </h2>
        </div>
        <div className="card__body">
          {appointments.length === 0 ? (
            <p className="text-color-text-secondary text-center py-8">
              No appointments scheduled. Add your first appointment above!
            </p>
          ) : (
            <div className="space-y-4">
              {appointments
                .sort(
                  (a, b) =>
                    new Date(`${a.date}T${a.time}`).getTime() -
                    new Date(`${b.date}T${b.time}`).getTime()
                )
                .map((apt) => {
                  const statusInfo = getAppointmentStatus(apt.date, apt.time);
                  return (
                    <div
                      key={apt.id}
                      className="card"
                      style={{ borderLeft: `4px solid ${statusInfo.color}` }}
                    >
                      <div className="card__body">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{apt.patientName}</h3>
                            <p className="text-sm text-color-text-secondary">
                              with {apt.doctorName || 'Doctor'} • {apt.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="status"
                              style={{
                                background: `${statusInfo.color}22`,
                                color: statusInfo.color,
                                border: `1px solid ${statusInfo.color}`,
                              }}
                            >
                              {statusInfo.status}
                            </span>
                            <button
                              className="btn btn--outline btn--sm"
                              onClick={() => deleteAppointment(apt.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-color-primary" />
                            {new Date(`${apt.date}T${apt.time}`).toLocaleString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          {apt.phone && (
                            <div className="flex items-center gap-2">
                              <MessageSquare size={16} className="text-color-success" />
                              {apt.phone}
                            </div>
                          )}
                          {apt.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-color-info" />
                              {apt.email}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          {apt.reminder24h && (
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{ background: 'var(--color-secondary)' }}
                            >
                              ✓ 24h reminder sent
                            </span>
                          )}
                          {apt.reminder1h && (
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{ background: 'var(--color-secondary)' }}
                            >
                              ✓ 1h reminder sent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
