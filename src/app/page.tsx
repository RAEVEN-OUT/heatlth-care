"use client";

import { useState } from 'react';
import { Box, Bot } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { PatientProfileCard } from "@/components/dashboard/patient-profile-card";
import { HealthMetricCard } from "@/components/dashboard/health-metric-card";
import { MedicationRemindersCard } from "@/components/dashboard/medication-reminders-card";
import { FeatureCard } from "@/components/dashboard/feature-card";
import { ReportGeneratorCard } from "@/components/dashboard/report-generator-card";
import { SymptomCheckerDialog } from '@/components/dashboard/symptom-checker-dialog';
import { ARAnatomyDialog } from '@/components/dashboard/ar-anatomy-dialog';
import { healthMetrics } from "@/lib/data";

export default function Home() {
  const [symptomCheckerOpen, setSymptomCheckerOpen] = useState(false);
  const [arAnatomyOpen, setArAnatomyOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          <DashboardHeader />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Main Content */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <ReportGeneratorCard />
              </div>
              {healthMetrics.map((metric) => (
                <HealthMetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <PatientProfileCard />
              <MedicationRemindersCard />
              <div onClick={() => setArAnatomyOpen(true)}>
                <FeatureCard
                  Icon={Box}
                  title="AR Anatomy Visualizer"
                  description="Visualize the human anatomy in 3D augmented reality for patient education."
                  badgeText="Mobile Only"
                  badgeVariant="outline"
                />
              </div>
              <div onClick={() => setSymptomCheckerOpen(true)}>
                <FeatureCard
                  Icon={Bot}
                  title="AI Symptom Checker"
                  description="Get potential insights into your symptoms with our AI-powered chatbot."
                  badgeText="Beta"
                  badgeVariant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SymptomCheckerDialog open={symptomCheckerOpen} onOpenChange={setSymptomCheckerOpen} />
      <ARAnatomyDialog open={arAnatomyOpen} onOpenChange={setArAnatomyOpen} />
    </div>
  );
}
