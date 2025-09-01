export interface Candidate {
  id?: string;
  name: string;
  education: string;
  skills: string[];
  interests: string[];
  location: string;
}

export interface Internship {
  id: string;
  title: string;
  sector: string;
  skills_required: string[];
  location: string;
  stipend: number;
  capacity: number;
  department: string;
  description?: string;
}

export interface RecommendationResponse {
  internships: Internship[];
  match_scores: number[];
}

export type Department = 'IT' | 'Finance' | 'Healthcare' | 'Education' | 'Marketing' | 'Operations';

export const DEPARTMENTS: Department[] = ['IT', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Operations'];