import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  Language,
  DoubtQuestion,
  QuestionCluster,
  ProjectPost,
  ProblemSolution,
  Opportunity,
  StudentSkill,
  CustomUserProject
} from '../types';
import {
  CURRENT_USER
} from '../data/mockData';
import { loginUser, signupUser } from '../api/auth';

interface AppContextType {
  user: StudentProfile;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  doubts: DoubtQuestion[];
  clusters: QuestionCluster[];
  fetchClusters: () => Promise<void>;
  projects: ProjectPost[];
  problemsSolutions: ProblemSolution[];
  opportunities: Opportunity[];
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isAskDoubtModalOpen: boolean;
  setIsAskDoubtModalOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isEditPortfolioOpen: boolean;
  setIsEditPortfolioOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<StudentProfile> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loginAsDemoStudent: () => void;
  updateUserProfile: (updated: Partial<StudentProfile>) => void;
  addSkill: (skill: StudentSkill) => void;
  removeSkill: (skillName: string) => void;
  addCustomProject: (proj: Omit<CustomUserProject, 'id'>) => void;
  removeCustomProject: (id: string) => void;
  addDoubt: (doubt: Omit<DoubtQuestion, 'id' | 'timestamp' | 'upvotes' | 'answers'>) => void;
  addAnswer: (doubtId: string, content: string, isAnonymous: boolean) => void;
  addProject: (proj: Omit<ProjectPost, 'id' | 'creatorId' | 'creatorName' | 'creatorCollege' | 'currentMembers' | 'problemsSolutionsCount'>) => void;
  addProblemSolution: (ps: Omit<ProblemSolution, 'id' | 'authorName' | 'authorCollege' | 'upvotes' | 'timestamp'>) => void;
  joinProjectRequest: (projectId: string) => void;
  upvoteDoubt: (id: string) => void;
  upvoteSolution: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'connected_is_authenticated_v3',
  USER: 'connected_user_profile_v3',
  DOUBTS: 'connected_doubts_v3',
  PROJECTS: 'connected_projects_v3',
  SOLUTIONS: 'connected_solutions_v3',
  LANG: 'connected_lang_v3',
  THEME: 'connected_theme_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const [user, setUser] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return CURRENT_USER;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light';
  });

  // Default initial data to empty arrays [] for clean production boot
  const [doubts, setDoubts] = useState<DoubtQuestion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOUBTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return []; // Production clean state
  });

  const [clusters, setClusters] = useState<QuestionCluster[]>([]);

  const [projects, setProjects] = useState<ProjectPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return []; // Production clean state
  });

  const [problemsSolutions, setProblemsSolutions] = useState<ProblemSolution[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOLUTIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return []; // Production clean state
  });

  const [opportunities] = useState<Opportunity[]>([]);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isAskDoubtModalOpen, setIsAskDoubtModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isEditPortfolioOpen, setIsEditPortfolioOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
  }, [doubts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(problemsSolutions));
  }, [problemsSolutions]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const login = async (email: string, password: string) => {
    const backendUser = await loginUser(email, password);
    setUser(prev => ({ ...prev, ...backendUser }));
    setIsAuthenticated(true);
  };

  const signup = async (userData: Partial<StudentProfile> & { email: string; password: string }) => {
    const backendUser = await signupUser({
      name: userData.name || 'New Student',
      email: userData.email,
      password: userData.password,
      college: userData.college || 'Engineering Institute',
      branch: userData.branch || 'Computer Science',
      year: userData.year || '1st Year',
      career_goal: userData.careerGoal || 'Software Engineer'
    });
    const newUser: StudentProfile = {
      ...backendUser,
      avatar: '',
      bio: '',
      reputationPoints: backendUser.reputationPoints,
      badges: [],
      completedRoadmapLevels: 1,
      anonymousAlias: `Student #${Math.floor(1000 + Math.random() * 9000)}`,
      skills: []
    };
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const loginAsDemoStudent = () => {
    setUser(CURRENT_USER);
    setIsAuthenticated(true);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const toggleTheme = () => setTheme(current => current === 'light' ? 'dark' : 'light');

  const updateUserProfile = (updated: Partial<StudentProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const addSkill = (newSkill: StudentSkill) => {
    setUser(prev => {
      const existingIdx = prev.skills.findIndex(s => s.name.toLowerCase() === newSkill.name.toLowerCase());
      let updatedSkills = [...prev.skills];
      if (existingIdx >= 0) {
        updatedSkills[existingIdx] = newSkill;
      } else {
        updatedSkills.push(newSkill);
      }
      return { ...prev, skills: updatedSkills };
    });
  };

  const removeSkill = (skillName: string) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name.toLowerCase() !== skillName.toLowerCase())
    }));
  };

  const addCustomProject = (proj: Omit<CustomUserProject, 'id'>) => {
    const newProj: CustomUserProject = {
      ...proj,
      id: `custom-${Date.now()}`
    };
    setUser(prev => ({
      ...prev,
      customProjects: [...(prev.customProjects || []), newProj]
    }));
  };

  const removeCustomProject = (id: string) => {
    setUser(prev => ({
      ...prev,
      customProjects: (prev.customProjects || []).filter(p => p.id !== id)
    }));
  };

  const addDoubt = async (
  newDoubtData: Omit<
    DoubtQuestion,
    'id' | 'timestamp' | 'upvotes' | 'answers'
  >
) => {
  try {
    const response = await fetch(
      'http://localhost:8000/api/ai/doubt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newDoubtData.content,
          subject: newDoubtData.category,
          context: newDoubtData.title,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || 'Failed to submit doubt'
      );
    }

    const data = await response.json();

    console.log('AI doubt response:', data);

    const newDoubt: DoubtQuestion = {
      ...newDoubtData,

      // Use backend ID if available
      id: data.doubt?.id || `d-${Date.now()}`,

      timestamp: 'Just now',
      upvotes: 1,

      answers: [
        {
          id: `ans-ai-${Date.now()}`,
          authorName: 'ConnectED AI Assistant',
          authorType: 'AI',
          content:
            data.answer ||
            `AI Analysis for "${newDoubtData.title}":\n${data.explanation || 'Your question has been analyzed by ConnectED AI.'}`,
          upvotes: 0,
          timestamp: 'Just now',
        },
      ],

      peerRouting: [
        {
          studentId: user.id,
          studentName: user.name,
          college: user.college,
          matchReason: 'Possesses matching verified skill.',
          solvedProject: 'Recent Hardware Project',
          compatibilityScore: 92,
        },
      ],

      clusterTopic:
        data.cluster_topic ||
        'Hardware & Sensor Signals',
    };

    setDoubts(prev => [newDoubt, ...prev]);

    setUser(prev => ({
      ...prev,
      reputationPoints: prev.reputationPoints + 15,
    }));

  } catch (error) {
    console.error('Failed to submit doubt:', error);

    alert(
      'Unable to submit doubt. Please make sure the backend is running.'
    );
  }
};
const fetchClusters = async () => {
  try {
    const response = await fetch(
      'http://localhost:8000/api/cluster-doubts'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch clusters');
    }

    const data = await response.json();

    console.log('Cluster API Response:', data);

    const backendClusters = data.clusters || [];

    const formattedClusters: QuestionCluster[] =
      backendClusters.map((cluster: any) => ({
        id: cluster.id,
        topicTitle:
          cluster.topicTitle || 'Untitled Topic',
        description:
          cluster.description ||
          'Related questions identified by ConnectED AI.',
        questionCount:
          cluster.questionCount || 0,
        affectedCollegesCount:
          cluster.affectedCollegesCount || 0,
      }));

    setClusters(formattedClusters);

  } catch (error) {
    console.error(
      'Failed to fetch AI clusters:',
      error
    );

    setClusters([]);
  }
};

  const addAnswer = async (
  doubtId: string,
  content: string,
  isAnonymous: boolean
) => {
  if (!content.trim()) return;

  try {
    const response = await fetch(
  'http://localhost:8000/api/cluster-doubts'
);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || 'Failed to post answer'
      );
    }

    const data = await response.json();

    const savedAnswer = data.answer;

    // Update UI immediately with the answer returned by backend
    setDoubts(prev =>
      prev.map(d => {
        if (d.id === doubtId) {
          const newAns = {
            id: savedAnswer.id,
            authorName: savedAnswer.author_alias,
            authorType: 'Peer' as const,
            authorCollege: isAnonymous ? undefined : user.college,
            content: savedAnswer.content,
            upvotes: savedAnswer.upvotes ?? 0,
            timestamp: 'Just now',
            isIdentityRevealed: !isAnonymous,
          };

          return {
            ...d,
            answers: [...(d.answers || []), newAns],
          };
        }

        return d;
      })
    );

    // Reward student for helping another student
    setUser(prev => ({
      ...prev,
      reputationPoints: prev.reputationPoints + 35,
    }));

    console.log('Answer saved successfully:', savedAnswer);

  } catch (error) {
    console.error('Failed to post answer:', error);
    alert('Unable to post answer. Please try again.');
  }
};

  const addProject = (projData: Omit<ProjectPost, 'id' | 'creatorId' | 'creatorName' | 'creatorCollege' | 'currentMembers' | 'problemsSolutionsCount'>) => {
    const newProj: ProjectPost = {
      ...projData,
      id: `proj-${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorCollege: user.college,
      currentMembers: [
        {
          id: user.id,
          name: user.name,
          college: user.college,
          role: 'Project Creator & Lead',
          skills: user.skills.map(s => s.name),
          avatar: user.avatar
        }
      ],
      problemsSolutionsCount: 0
    };
    setProjects([newProj, ...projects]);
    setUser(prev => ({ ...prev, reputationPoints: prev.reputationPoints + 50 }));
  };

  const addProblemSolution = (psData: Omit<ProblemSolution, 'id' | 'authorName' | 'authorCollege' | 'upvotes' | 'timestamp'>) => {
    const newPS: ProblemSolution = {
      ...psData,
      id: `ps-${Date.now()}`,
      authorName: user.name,
      authorCollege: user.college,
      upvotes: 1,
      timestamp: 'Just now'
    };
    setProblemsSolutions([newPS, ...problemsSolutions]);
    setUser(prev => ({ ...prev, reputationPoints: prev.reputationPoints + 40 }));
  };

  const joinProjectRequest = (projectId: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const alreadyIn = p.currentMembers.some(m => m.id === user.id);
          if (alreadyIn) return p;
          return {
            ...p,
            currentMembers: [
              ...p.currentMembers,
              {
                id: user.id,
                name: user.name,
                college: user.college,
                role: 'Collaborator',
                skills: user.skills.map(s => s.name),
                avatar: user.avatar
              }
            ]
          };
        }
        return p;
      })
    );
  };

  const upvoteDoubt = async (doubtId: string) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/doubts/${doubtId}/upvote?user_id=${encodeURIComponent(user.id)}`,
      {
        method: 'POST',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || 'Failed to upvote doubt'
      );
    }

    console.log('Upvote response:', data);

    setDoubts(prev =>
      prev.map(d =>
        d.id === doubtId
          ? {
              ...d,
              upvotes: data.upvotes,
            }
          : d
      )
    );

  } catch (error) {
    console.error('Failed to upvote:', error);
  }
};

  const upvoteSolution = (id: string) => {
    setProblemsSolutions(prev => prev.map(s => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s)));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        language,
        setLanguage,
        theme,
        toggleTheme,
        doubts,
        clusters,
        fetchClusters,
        projects,
        problemsSolutions,
        opportunities,
        isCopilotOpen,
        setIsCopilotOpen,
        isAskDoubtModalOpen,
        setIsAskDoubtModalOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isEditPortfolioOpen,
        setIsEditPortfolioOpen,
        login,
        signup,
        logout,
        loginAsDemoStudent,
        updateUserProfile,
        addSkill,
        removeSkill,
        addCustomProject,
        removeCustomProject,
        addDoubt,
        addAnswer,
        addProject,
        addProblemSolution,
        joinProjectRequest,
        upvoteDoubt,
        upvoteSolution,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
