import type { LucideIcon } from "lucide-react";
import { HeartPulse, Droplets, Footprints, Pill } from "lucide-react";

export type HealthMetric = {
  id: string;
  name: string;
  value: string;
  unit: string;
  Icon: LucideIcon;
  data: { time: string; value: number }[];
};

export const healthMetrics: HealthMetric[] = [
  {
    id: "heart-rate",
    name: "Heart Rate",
    value: "78",
    unit: "bpm",
    Icon: HeartPulse,
    data: [
      { time: "00:00", value: 72 },
      { time: "03:00", value: 75 },
      { time: "06:00", value: 80 },
      { time: "09:00", value: 78 },
      { time: "12:00", value: 82 },
      { time: "15:00", value: 85 },
      { time: "18:00", value: 78 },
    ],
  },
  {
    id: "blood-oxygen",
    name: "Blood Oxygen",
    value: "98",
    unit: "%",
    Icon: Droplets,
    data: [
      { time: "00:00", value: 99 },
      { time: "03:00", value: 98 },
      { time: "06:00", value: 97 },
      { time: "09:00", value: 98 },
      { time: "12:00", value: 99 },
      { time: "15:00", value: 98 },
      { time: "18:00", value: 98 },
    ],
  },
  {
    id: "steps",
    name: "Steps Today",
    value: "8,230",
    unit: "steps",
    Icon: Footprints,
    data: [
      { time: "00:00", value: 100 },
      { time: "03:00", value: 200 },
      { time: "06:00", value: 1500 },
      { time: "09:00", value: 3000 },
      { time: "12:00", value: 5500 },
      { time: "15:00", value: 7000 },
      { time: "18:00", value: 8230 },
    ],
  },
];

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  Icon: LucideIcon;
};

export const medications: Medication[] = [
  {
    id: "lisinopril",
    name: "Lisinopril",
    dosage: "10mg",
    time: "9:00 AM",
    Icon: Pill,
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    dosage: "20mg",
    time: "8:00 PM",
    Icon: Pill,
  },
  {
    id: "metformin",
    name: "Metformin",
    dosage: "500mg",
    time: "9:00 AM & 8:00 PM",
    Icon: Pill,
  },
];

export const patientProfile = {
  name: "Jane Doe",
  age: 45,
  bloodType: "O+",
};
