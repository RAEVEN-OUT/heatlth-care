// Drug Types
export interface DrugInfo {
  brandName: string;
  genericName: string;
  purpose: string;
  warnings: string;
  dosage: string;
  interactions: string;
  sideEffects: string;
}

// Nutrition Types
export interface NutritionData {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

export interface NutritionalFood {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  serving_qty: number;
  serving_unit: string;
}

// Symptom Checker Types
export interface SymptomMention {
  id: string;
  name: string;
  choice_id: string;
}

export interface Condition {
  id: string;
  common_name: string;
  probability: number;
}

export interface DiagnosisResult {
  conditions: Condition[];
  question?: {
    text: string;
    items: Array<{ id: string; name: string; }>;
  };
}

// Health Vitals Types
export interface VitalStatus {
  value: number;
  unit: string;
  status: 'normal' | 'low' | 'high';
}

export interface BloodPressure {
  systolic: number;
  diastolic: number;
  status: 'normal' | 'low' | 'high';
}

export interface Vitals {
  heartRate: VitalStatus;
  bloodPressure: BloodPressure;
  oxygenLevel: VitalStatus;
  temperature: VitalStatus;
}

export interface HealthHistory {
  id: number;
  type: string;
  value: string;
  timestamp: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  phone: string;
  email: string;
  reminder24h: boolean;
  reminder1h: boolean;
  createdAt: string;
}
