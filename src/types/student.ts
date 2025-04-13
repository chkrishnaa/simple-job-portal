export interface StudentDetails {
  name: string;
  tenthMarks: string;
  twelfthMarks: string;
  cgpa: string;
  branch: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
  }[];
  certifications: string[];
  achievements: string[];
  internships: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
}

export interface PredictionResult {
  predictedRole: string;
  predictedSalary: string;
  predictedCompanies: string[];
  confidence: number;
}