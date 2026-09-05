export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn' | 'gu' | 'pa' | 'ml' | 'or' | 'as' | 'ur' | 'raj' | 'bho' | 'mai' | 'sd' | 'ks' | 'kok' | 'mni';

export interface StudentSkill {
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  score: number; // 0-100
  verified: boolean;
  projectsCount: number;
  challengesCount: number;
}

export interface CustomUserProject {
  id: string;
  title: string;
  description: string;
  role: string;
  repoUrl?: string;
  demoUrl?: string;
  skillsUsed: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  college: string;
  branch: string;
  year: string;
  avatar: string;
  bio: string;
  careerGoal: string;
  reputationPoints: number;
  badges: string[];
  skills: StudentSkill[];
  completedRoadmapLevels: number;
  anonymousAlias: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  achievements?: string[];
  customProjects?: CustomUserProject[];
}

export interface QuestionAnswer {
  id: string;
  authorName: string;
  authorType: 'AI' | 'Peer' | 'Peer Mentor' | 'Verified Mentor';
  authorCollege?: string;
  content: string;
  upvotes: number;
  timestamp: string;
  isIdentityRevealed?: boolean;
}

export interface PeerRoutingMatch {
  studentId: string;
  studentName: string;
  college: string;
  matchReason: string;
  solvedProject: string;
  compatibilityScore: number;
}

export interface DoubtQuestion {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  authorAlias: string;
  authorId: string;
  category: string;
  language: Language;
  hasVoice: boolean;
  hasImage: boolean;
  imageUrl?: string;
  clusterTopic?: string;
  clusterId?: string;
  peerRouting?: PeerRoutingMatch[];
  answers: QuestionAnswer[];
  timestamp: string;
  upvotes: number;
}

export interface QuestionCluster {
  id: string;
  topicTitle: string;
  description: string;
  questionCount: number;
  affectedCollegesCount: number;
  learningGapDetected: boolean;
  recommendedResources: { title: string; type: 'Doc' | 'Video' | 'Project' | 'Session'; url: string }[];
}

export interface TeamMember {
  id: string;
  name: string;
  college: string;
  role: string;
  skills: string[];
  avatar: string;
}

export interface ProjectPost {
  id: string;
  title: string;
  problemStatement: string;
  description: string;
  stage: 'Idea' | 'Prototype' | 'In Progress' | 'Testing' | 'Completed';
  duration: string;
  creatorId: string;
  creatorName: string;
  creatorCollege: string;
  currentMembers: TeamMember[];
  requiredSkills: string[];
  missingSkills: string[];
  compatibilityScore?: number;
  repoUrl?: string;
  docUrl?: string;
  cadUrl?: string;
  circuitUrl?: string;
  problemsSolutionsCount: number;
}

export interface ProblemSolution {
  id: string;
  projectId: string;
  projectTitle: string;
  problem: string;
  possibleCause: string;
  solution: string;
  authorName: string;
  authorCollege: string;
  upvotes: number;
  tags: string[];
  timestamp: string;
}

export interface CareerRoadmapLevel {
  levelNumber: number;
  title: string;
  description: string;
  skills: string[];
  projects: string[];
  completed: boolean;
}

export interface CareerRoadmap {
  goalTitle: string;
  targetRole: string;
  progressPercent: number;
  levels: CareerRoadmapLevel[];
}

export interface Mentor {
  id: string;
  name: string;
  role: 'Professor' | 'Industry Professional' | 'Researcher' | 'Alumni' | 'Peer Mentor';
  organization: string;
  domain: string;
  skills: string[];
  experienceYears: number;
  rating: number;
  availability: string;
  bio: string;
  avatar: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Hackathon' | 'Internship' | 'Scholarship' | 'Competition' | 'Research' | 'Fellowship' | 'Job' | 'Workshop';
  organization: string;
  matchScore: number;
  matchingReason: string[];
  requiredSkills: string[];
  missingSkills: string[];
  deadline: string;
  stipendOrPrize?: string;
  location: string;
  applicationUrl?: string;
}

export interface AICopilotRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  type: 'learning' | 'project' | 'mentorship' | 'opportunity' | 'doubt';
  linkTo: string;
}
