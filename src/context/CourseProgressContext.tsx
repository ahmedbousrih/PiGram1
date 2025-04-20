import React, { createContext, useContext, useState, useEffect } from 'react';
import { Badge } from '../types/badge';
import { 
  FaMedal, 
  FaSquareRootAlt, 
  FaTrophy, 
  FaFire, 
  FaStar, 
  FaBolt,
  FaMoon,
  FaSun 
} from 'react-icons/fa';
import { db, auth } from '../config/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

interface LessonProgress {
  completed: boolean;
  timestamp: number;
}

interface CourseProgress {
  quizProgress: Record<string, QuizProgress>;
  scrollProgress: Record<string, number>;
  lessonProgress: Record<string, LessonProgress>;
  badges: Record<string, Badge>;
  recentActivities: Activity[];
}

interface QuizProgress {
  completed: boolean;
  correct: boolean;
  timestamp: number;
}

interface Activity {
  id: string;
  type: 'lesson' | 'quiz' | 'badge';
  courseId: string;
  title: string;
  timestamp: number;
  progress?: number;
}

interface CourseProgressContextType {
  quizProgress: Record<string, QuizProgress>;
  updateQuizProgress: (sectionId: string, questionId: string, correct: boolean) => void;
  updateScrollProgress: (courseId: string, progress: number) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getTotalProgress: () => number;
  getCourseProgress: (courseId: string) => number;
  getSectionProgress: (sectionId: string) => number;
  getLastAccessed: () => { title: string; progress: number } | null;
  badges: Record<string, Badge>;
  unlockBadge: (badgeId: string) => void;
  checkBadgeProgress: () => void;
  loading: boolean;
  progress: CourseProgress;
  isAuthenticated: boolean;
}

// Update the SerializedBadge type
type SerializedBadge = Omit<Badge, 'icon'> & {
  iconName: string;
};

// Add helper functions to serialize/deserialize badges
const serializeBadge = (badge: Badge): SerializedBadge => {
  const { icon, ...rest } = badge;
  return {
    ...rest,
    iconName: getIconName(icon)
  };
};

const getIconName = (icon: React.ReactNode): string => {
  // Map icons to string names
  if (icon && typeof icon === 'object' && 'type' in icon) {
    switch (icon.type) {
      case FaBolt: return 'bolt';
      case FaSquareRootAlt: return 'square-root';
      case FaTrophy: return 'trophy';
      case FaFire: return 'fire';
      case FaStar: return 'star';
      case FaMoon: return 'moon';
      case FaSun: return 'sun';
      default: return 'default';
    }
  }
  return 'default';
};

const getIconComponent = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case 'bolt': return <FaBolt />;
    case 'square-root': return <FaSquareRootAlt />;
    case 'trophy': return <FaTrophy />;
    case 'fire': return <FaFire />;
    case 'star': return <FaStar />;
    case 'moon': return <FaMoon />;
    case 'sun': return <FaSun />;
    default: return <FaMedal />;
  }
};

const initialProgress: CourseProgress = {
  quizProgress: {},
  scrollProgress: {
    'math-beg': 0,
    'math-int': 0,
    'math-adv': 0
  },
  lessonProgress: {},
  badges: {
    'quick-learner': {
      id: 'quick-learner',
      title: 'Quick Learner',
      description: 'Complete 5 lessons in a day',
      unlocked: false,
      progress: 0,
      icon: <FaBolt />
    },
    'math-master': {
      id: 'math-master',
      title: 'Math Master',
      description: 'Complete Basic Mathematics course',
      unlocked: false,
      progress: 0,
      icon: <FaSquareRootAlt />
    },
    'perfect-score': {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Get 100% in all quizzes',
      unlocked: false,
      progress: 0,
      icon: <FaTrophy />
    }
  },
  recentActivities: []
};

const additionalBadges = {
  'streak-master': {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Complete lessons for 7 days in a row',
    unlocked: false,
    progress: 0,
    icon: <FaFire />
  },
  'quiz-champion': {
    id: 'quiz-champion',
    title: 'Quiz Champion',
    description: 'Complete 10 quizzes with perfect scores',
    unlocked: false,
    progress: 0,
    icon: <FaStar />
  },
  'speed-learner': {
    id: 'speed-learner',
    title: 'Speed Learner',
    description: 'Complete a course in under 24 hours',
    unlocked: false,
    icon: <FaBolt />
  },
  'night-owl': {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Study between 10 PM and 5 AM',
    unlocked: false,
    icon: <FaMoon />
  },
  'early-bird': {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Study between 5 AM and 8 AM',
    unlocked: false,
    icon: <FaSun />
  }
};

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);

export const CourseProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<CourseProgress>(initialProgress);
  const [loading, setLoading] = useState(true);

  // Reset progress when user logs out
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userProgressRef = doc(db, 'userProgress', user.uid);
          
          // Set up real-time listener for this specific user's progress
          const unsubscribeProgress = onSnapshot(userProgressRef, 
            (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                if (isValidProgressData(data)) {
                  // Convert stored data back to progress format with icons
                  const progressWithIcons = {
                    ...data,
                    badges: Object.entries(data.badges).reduce((acc, [key, badge]: [string, any]) => ({
                      ...acc,
                      [key]: {
                        ...badge,
                        icon: getIconComponent(badge.iconName || 'default')
                      }
                    }), {})
                  };
                  setProgress(progressWithIcons as CourseProgress);
                } else {
                  // Initialize new user with default progress
                  setProgress(initialProgress);
                  updateFirestore(initialProgress);
                }
              } else {
                // New user, initialize with default progress
                setProgress(initialProgress);
                updateFirestore(initialProgress);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Error fetching progress:', error);
              setProgress(initialProgress);
              setLoading(false);
            }
          );

          return () => unsubscribeProgress();
        } catch (error) {
          console.error('Error setting up progress listener:', error);
          setProgress(initialProgress);
          setLoading(false);
        }
      } else {
        // User logged out, reset to initial state
        setProgress(initialProgress);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Update the isValidProgressData function
  const isValidProgressData = (data: any): data is CourseProgress => {
    return (
      data &&
      typeof data === 'object' &&
      'quizProgress' in data &&
      typeof data.quizProgress === 'object' &&
      'scrollProgress' in data &&
      typeof data.scrollProgress === 'object' &&
      'lessonProgress' in data &&
      typeof data.lessonProgress === 'object' &&
      'badges' in data &&
      typeof data.badges === 'object' &&
      Object.values(data.badges).every((badge: any) => 
        badge && 
        typeof badge === 'object' && 
        'iconName' in badge && 
        typeof badge.iconName === 'string'
      ) &&
      'recentActivities' in data &&
      Array.isArray(data.recentActivities)
    );
  };

  // Update the updateFirestore function to always use current user's ID
  const updateFirestore = async (newProgress: CourseProgress) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot update progress: No user logged in');
      return;
    }

    try {
      const cleanProgress = {
        ...newProgress,
        badges: Object.entries(newProgress.badges).reduce((acc, [key, badge]) => ({
          ...acc,
          [key]: {
            id: badge.id,
            title: badge.title,
            description: badge.description,
            unlocked: badge.unlocked,
            unlockedAt: badge.unlockedAt,
            progress: badge.progress,
            iconName: getIconName(badge.icon)
          }
        }), {}),
        quizProgress: newProgress.quizProgress,
        scrollProgress: newProgress.scrollProgress,
        lessonProgress: newProgress.lessonProgress,
        recentActivities: newProgress.recentActivities,
        lastUpdated: new Date().toISOString(),
        userId: user.uid // Add user ID to the progress data
      };

      const userProgressRef = doc(db, 'userProgress', user.uid);
      await setDoc(userProgressRef, cleanProgress, { merge: true });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Modify progress tracking functions to check for auth
  const updateScrollProgress = async (courseId: string, scrollProgress: number) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot track progress: No user logged in');
      return;
    }

    if (!courseId) return;
    
    try {
      const newProgress = {
        ...progress,
        scrollProgress: {
          ...progress.scrollProgress,
          [courseId]: Math.max(progress.scrollProgress?.[courseId] || 0, scrollProgress)
        }
      };

      setProgress(newProgress);
      await updateFirestore(newProgress);
    } catch (error) {
      console.error('Error updating scroll progress:', error);
    }
  };

  const updateQuizProgress = async (sectionId: string, questionId: string, correct: boolean) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot track quiz progress: No user logged in');
      return;
    }

    if (!sectionId || !questionId) return;
    
    const newProgress = {
      ...progress,
      quizProgress: {
        ...progress.quizProgress,
        [`${sectionId}-${questionId}`]: {
          completed: true,
          correct,
          timestamp: Date.now()
        }
      }
    };
    
    setProgress(newProgress);
    await updateFirestore(newProgress);
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Cannot mark lesson complete: No user logged in');
      return;
    }

    if (!courseId || !lessonId) return;
    
    const newProgress: CourseProgress = {
      ...progress,
      lessonProgress: {
        ...progress.lessonProgress,
        [`${courseId}-${lessonId}`]: {
          completed: true,
          timestamp: Date.now()
        }
      },
      recentActivities: [
        {
          id: `${Date.now()}`,
          type: 'lesson',
          courseId,
          title: `Completed ${lessonId}`,
          timestamp: Date.now(),
          progress: getCourseProgress(courseId)
        },
        ...progress.recentActivities.slice(0, 9)
      ]
    };
    
    setProgress(newProgress);
    await updateFirestore(newProgress);
  };

  const getCourseProgress = (courseId: string) => {
    if (!courseId) return 0;
    
    try {
      const quizzes = Object.entries(progress.quizProgress || {})
        .filter(([key]) => key.startsWith(courseId));
      
      const scrollWeight = 0.3;
      const quizWeight = 0.7;
      
      const scrollProgress = progress.scrollProgress?.[courseId] || 0;
      const quizProgress = quizzes.length > 0 
        ? (quizzes.filter(([_, q]) => q?.completed).length / quizzes.length) 
        : 0;
      
      return (scrollProgress * scrollWeight + quizProgress * quizWeight) * 100;
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return 0;
    }
  };

  const getTotalProgress = () => {
    try {
      const courses = ['math-beg', 'math-int', 'math-adv'];
      if (courses.length === 0) return 0;
      
      const totalProgress = courses.reduce((sum, courseId) => 
        sum + getCourseProgress(courseId), 0
      );
      
      return totalProgress / courses.length;
    } catch (error) {
      console.error('Error calculating total progress:', error);
      return 0;
    }
  };

  const getSectionProgress = (sectionId: string) => {
    if (!sectionId) return 0;
    
    try {
      const sectionQuizzes = Object.entries(progress.quizProgress || {})
        .filter(([key]) => key.startsWith(sectionId));
      
      if (sectionQuizzes.length === 0) return progress.scrollProgress?.[sectionId] || 0;
      
      const completedQuizzes = sectionQuizzes.filter(([_, quiz]) => quiz?.completed).length;
      const scrollProgress = progress.scrollProgress?.[sectionId] || 0;
      
      return (completedQuizzes / sectionQuizzes.length * 0.7 + scrollProgress * 0.3) * 100;
    } catch (error) {
      console.error('Error calculating section progress:', error);
      return 0;
    }
  };

  const getLastAccessed = () => {
    try {
      const entries = Object.entries(progress.quizProgress)
        .sort((a, b) => b[1].timestamp - a[1].timestamp);
      
      if (entries.length === 0) return null;
      
      const lastKey = entries[0][0];
      const courseId = lastKey.split('-')[0];
      
      const courseNames: Record<string, string> = {
        'math-beg': 'Basic Mathematics',
        'math-int': 'Intermediate Mathematics',
        'math-adv': 'Advanced Mathematics',
        'html-basics': 'HTML & CSS Basics',
        'js-basics': 'JavaScript Essentials',
        'python-basics': 'Python Fundamentals'
      };
      
      return {
        title: courseNames[courseId] || 'Unknown Course',
        progress: getCourseProgress(courseId)
      };
    } catch (error) {
      console.error('Error getting last accessed course:', error);
      return null;
    }
  };

  const unlockBadge = (badgeId: string) => {
    setProgress(prev => ({
      ...prev,
      badges: {
        ...prev.badges,
        [badgeId]: {
          ...prev.badges[badgeId],
          unlocked: true,
          unlockedAt: Date.now()
        }
      },
      recentActivities: [
        {
          id: `badge-${Date.now()}`,
          type: 'badge',
          courseId: 'system',
          title: `Earned ${prev.badges[badgeId].title} badge!`,
          timestamp: Date.now()
        },
        ...prev.recentActivities.slice(0, 9)
      ]
    }));
  };

  const checkBadgeProgress = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lessonsCompletedToday = Object.entries(progress.lessonProgress)
      .filter(([_, data]) => {
        const lessonDate = new Date(data.timestamp).setHours(0, 0, 0, 0);
        return lessonDate === today;
      })
      .length;

    if (lessonsCompletedToday >= 5 && !progress.badges['quick-learner'].unlocked) {
      unlockBadge('quick-learner');
    }

    const mathProgress = getCourseProgress('math-beg');
    if (mathProgress === 100 && !progress.badges['math-master'].unlocked) {
      unlockBadge('math-master');
    }

    const allQuizzes = Object.values(progress.quizProgress);
    const perfectScore = allQuizzes.length > 0 && allQuizzes.every(quiz => quiz.correct);
    if (perfectScore && !progress.badges['perfect-score'].unlocked) {
      unlockBadge('perfect-score');
    }
  };

  const mergeAdditionalBadges = () => {
    setProgress(prev => ({
      ...prev,
      badges: {
        ...prev.badges,
        ...Object.entries(additionalBadges).reduce((acc, [key, badge]) => ({
          ...acc,
          [key]: {
            ...badge,
            unlocked: prev.badges[key]?.unlocked || false,
            unlockedAt: prev.badges[key]?.unlockedAt,
            progress: prev.badges[key]?.progress || 0
          }
        }), {})
      }
    }));
  };

  useEffect(() => {
    mergeAdditionalBadges();
  }, []);

  return (
    <CourseProgressContext.Provider value={{
      quizProgress: progress.quizProgress,
      updateQuizProgress,
      updateScrollProgress,
      markLessonComplete,
      getTotalProgress,
      getCourseProgress,
      getSectionProgress,
      getLastAccessed,
      badges: progress.badges,
      unlockBadge,
      checkBadgeProgress,
      loading,
      progress,
      isAuthenticated: !!auth.currentUser
    }}>
      {children}
    </CourseProgressContext.Provider>
  );
};

export const useCourseProgress = () => {
  const context = useContext(CourseProgressContext);
  if (!context) {
    throw new Error('useCourseProgress must be used within a CourseProgressProvider');
  }
  return context;
}; 