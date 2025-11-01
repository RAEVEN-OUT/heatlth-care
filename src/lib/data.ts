export type HealthMetric = {
  id: string;
  name: string;
  value: string;
  unit: string;
  data: { time: string; value: number }[];
};

export type Medication = {
  id: string;
  name:string;
  dosage: string;
  time: string;
  icon: string;
};

export type PatientProfile = {
  id: string;
  name: string;
  age: number;
  bloodType: string;
};
