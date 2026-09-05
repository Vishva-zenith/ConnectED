import {
  StudentProfile,
  DoubtQuestion,
  QuestionCluster,
  ProjectPost,
  ProblemSolution,
  CareerRoadmap,
  Mentor,
  Opportunity,
  AICopilotRecommendation
} from '../types';

export const CURRENT_USER: StudentProfile = {
  id: 'local-user',
  name: 'Student',
  college: '',
  branch: '',
  year: '',
  avatar: '',
  bio: '',
  careerGoal: '',
  reputationPoints: 0,
  badges: [],
  skills: [],
  completedRoadmapLevels: 0,
  anonymousAlias: 'Anonymous Student',
  customProjects: []
};

export const MOCK_CLUSTERS: QuestionCluster[] = [];
export const MOCK_DOUBTS: DoubtQuestion[] = [];
export const MOCK_PROJECTS: ProjectPost[] = [];
export const MOCK_PROBLEMS_SOLUTIONS: ProblemSolution[] = [];
export const MOCK_ROADMAP: CareerRoadmap = {
  goalTitle: '',
  targetRole: '',
  progressPercent: 0,
  levels: []
};
export const MOCK_MENTORS: Mentor[] = [];
export const MOCK_OPPORTUNITIES: Opportunity[] = [];
export const MOCK_COPILOT_RECOMMENDATIONS: AICopilotRecommendation[] = [];
