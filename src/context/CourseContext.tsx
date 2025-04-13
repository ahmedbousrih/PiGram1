import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface CourseProgress {
  courseId: string;
  completed: string[];  // Array of completed lesson IDs
  lastAccessed: string;
  quizScores: Record<string, number>;
}

interface Progress {
  completed: string[];
}

interface CourseContextType {
  userProgress: Record<string, CourseProgress>;
  updateProgress: (courseId: string, lessonId: string) => Promise<void>;
  saveQuizScore: (courseId: string, quizId: string, score: number) => Promise<void>;
  getCourseProgress: (courseId: string) => CourseProgress | null;
  getProgress: (courseId: string) => Progress | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<Record<string, CourseProgress>>({});

  // Load user progress from Firebase
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      try {
        const progressDoc = await getDoc(doc(db, 'userProgress', user.email));
        if (progressDoc.exists()) {
          setUserProgress(progressDoc.data() as Record<string, CourseProgress>);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, [user]);

  // Update progress for a specific lesson
  const updateProgress = async (courseId: string, lessonId: string) => {
    if (!user) return;

    try {
      const currentProgress = userProgress[courseId] || {
        courseId,
        completed: [],
        lastAccessed: new Date().toISOString(),
        quizScores: {}
      };

      if (!currentProgress.completed.includes(lessonId)) {
        currentProgress.completed.push(lessonId);
      }
      currentProgress.lastAccessed = new Date().toISOString();

      const newProgress = {
        ...userProgress,
        [courseId]: currentProgress
      };

      setUserProgress(newProgress);
      await setDoc(doc(db, 'userProgress', user.email), newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Save quiz score
  const saveQuizScore = async (courseId: string, quizId: string, score: number) => {
    if (!user) return;

    try {
      const currentProgress = userProgress[courseId] || {
        courseId,
        completed: [],
        lastAccessed: new Date().toISOString(),
        quizScores: {}
      };

      currentProgress.quizScores[quizId] = score;
      currentProgress.lastAccessed = new Date().toISOString();

      const newProgress = {
        ...userProgress,
        [courseId]: currentProgress
      };

      setUserProgress(newProgress);
      await setDoc(doc(db, 'userProgress', user.email), newProgress);
    } catch (error) {
      console.error('Error saving quiz score:', error);
    }
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return userProgress[courseId] || null;
  };

  const getProgress = (courseId: string): Progress | undefined => {
    const progress = userProgress[courseId];
    if (!progress) return { completed: [] };
    
    // You might want to adjust this calculation based on your course structure
    const totalLessons = 10; // This should be dynamic based on your course
    return {
      completed: progress.completed.length > 0 ? progress.completed : []
    };
  };

  return (
    <CourseContext.Provider value={{
      userProgress,
      updateProgress,
      saveQuizScore,
      getCourseProgress,
      getProgress
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}; 