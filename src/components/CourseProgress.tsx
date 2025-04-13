import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';

interface Lesson {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalLessons: number;
  chapters: Chapter[];
}

interface Progress {
  completed: string[];
}

interface CourseProgressProps {
  course: Course;
  progress: Progress;
}

const ProgressContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
`;

const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: #04AA6D;
  transition: width 0.3s ease;
`;

const ChapterList = styled.div`
  margin-top: 20px;
`;

const ChapterItem = styled.div`
  margin-bottom: 16px;
`;

const ChapterTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`;

const CourseProgress: React.FC<CourseProgressProps> = ({ course, progress }) => {
  const { user } = useAuth();
  const { getCourseProgress } = useCourse();
  const courseProgress = getCourseProgress(course.id);

  const calculateChapterProgress = (chapter: Chapter): number => {
    if (!courseProgress) return 0;
    
    const completedLessons = chapter.lessons.filter(
      lesson => courseProgress.completed.includes(lesson.id)
    ).length;
    return Math.round((completedLessons / chapter.lessons.length) * 100);
  };

  const totalProgress = Math.round(
    ((courseProgress?.completed.length || 0) /
    course.chapters.reduce((acc: number, chapter: Chapter) => acc + chapter.lessons.length, 0)) * 100
  );

  return (
    <ProgressContainer>
      <h2>{course.title}</h2>
      <ProgressBar>
        <Progress $progress={totalProgress} />
      </ProgressBar>
      <p>{totalProgress}% Complete</p>

      <ChapterList>
        {course.chapters.map((chapter: Chapter) => (
          <ChapterItem key={chapter.id}>
            <ChapterTitle>{chapter.title}</ChapterTitle>
            <ProgressBar>
              <Progress $progress={calculateChapterProgress(chapter)} />
            </ProgressBar>
            <p>{calculateChapterProgress(chapter)}% Complete</p>
          </ChapterItem>
        ))}
      </ChapterList>
    </ProgressContainer>
  );
};

export default CourseProgress; 