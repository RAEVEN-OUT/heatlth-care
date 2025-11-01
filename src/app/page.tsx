'use client';

import { useState } from 'react';
import { Bot, Box, LayoutDashboard, Pill, User } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

import { DashboardHeader } from '@/components/dashboard/header';
import { PatientProfileCard } from '@/components/dashboard/patient-profile-card';
import { HealthMetricCard } from '@/components/dashboard/health-metric-card';
import { MedicationRemindersCard } from '@/components/dashboard/medication-reminders-card';
import { ReportGeneratorCard } from '@/components/dashboard/report-generator-card';
import { SymptomCheckerDialog } from '@/components/dashboard/symptom-checker-dialog';
import { ARAnatomyDialog } from '@/components/dashboard/ar-anatomy-dialog';

import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { HealthMetric } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase/provider';

function Dashboard() {
  const db = useFirestore();
  const { data: healthMetrics, loading } = useCollection<HealthMetric>(
    collection(db, 'healthMetrics'),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Main Content */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <ReportGeneratorCard />
        </div>
        {loading && Array.from({ length: 3 }).map((_, i) => (
           <div key={i} className="space-y-4 p-6 bg-card rounded-lg h-[280px]">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
        ))}
        {healthMetrics?.map((metric) => (
          <HealthMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <PatientProfileCard />
        <MedicationRemindersCard />
      </div>
    </div>
  );
}


export default function Home() {
  const [symptomCheckerOpen, setSymptomCheckerOpen] = useState(false);
  const [arAnatomyOpen, setArAnatomyOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="dark"
        >
          <SidebarHeader>
            <DashboardHeader />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activePage === 'dashboard'}
                  onClick={() => setActivePage('dashboard')}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activePage === 'profile'}
                  onClick={() => setActivePage('profile')}
                  tooltip="Patient Profile"
                >
                  <User />
                  Patient Profile
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activePage === 'reminders'}
                  onClick={() => setActivePage('reminders')}
                  tooltip="Medication Reminders"
                >
                  <Pill />
                  Medication Reminders
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="flex-col gap-4 !p-4">
              <div onClick={() => setArAnatomyOpen(true)}>
                <SidebarMenuButton>
                    <Box/>
                    AR Anatomy
                </SidebarMenuButton>
              </div>
              <div onClick={() => setSymptomCheckerOpen(true)}>
                <SidebarMenuButton>
                    <Bot />
                    AI Symptom Checker
                </SidebarMenuButton>
              </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4 sm:p-6 md:p-8 flex-1">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'profile' && <PatientProfileCard />}
            {activePage === 'reminders' && <MedicationRemindersCard />}
          </div>
        </SidebarInset>
      </div>
      <SymptomCheckerDialog
        open={symptomCheckerOpen}
        onOpenChange={setSymptomCheckerOpen}
      />
      <ARAnatomyDialog open={arAnatomyOpen} onOpenChange={setArAnatomyOpen} />
    </SidebarProvider>
  );
}
