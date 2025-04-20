import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { useCourseProgress } from '../context/CourseProgressContext';
import { FaSquareRootAlt, FaCheck, FaTrophy, FaBookOpen, FaCode, FaHtml5, FaMedal } from 'react-icons/fa';
import { Badge as BadgeType } from '../types/badge';
import { Badge as BadgeComponent } from '../components/Badge';
import BadgeModal from '../components/BadgeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { auth } from '../config/firebase';

const Container = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const RecentActivities = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewAll = styled(Link)`
  font-size: 14px;
  color: #6c63ff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c63ff;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h3`
  font-size: 16px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ActivityMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  gap: 16px;
`;

const BadgesSection = styled.div`
  margin-bottom: 40px;
`;

const BadgesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const BadgeShowcase = styled.div`
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #6c63ff 0%, #5a4fff 100%);
  border-radius: 16px;
  margin-bottom: 40px;
  color: white;
`;

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const ShowcaseBadge = styled(BadgeComponent)`
  transform: scale(0.8);
`;

const ExploreSection = styled.div`
  margin-top: 40px;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

interface Activity {
  id: string;
  type: string;
  title: string;
  course: string;
  progress: number;
  icon: React.ReactNode;
  timestamp: string;
}

const ProgressDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    getTotalProgress, 
    getCourseProgress,
    loading,
    progress,
    badges 
  } = useCourseProgress();
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const recentActivities = progress.recentActivities.map(activity => ({
    ...activity,
    icon: getActivityIcon(activity.type),
    timestamp: formatTimestamp(activity.timestamp),
    course: getCourseTitle(activity.courseId)
  }));

  const getCourseTitle = (courseId: string) => {
    const courseNames: Record<string, string> = {
      'math-beg': 'Basic Mathematics',
      'math-int': 'Intermediate Mathematics',
      'math-adv': 'Advanced Mathematics',
      'system': 'System'
    };
    return courseNames[courseId] || 'Unknown Course';
  };

  const getActivityIcon = (type: 'lesson' | 'quiz' | 'badge') => {
    switch (type) {
      case 'lesson':
        return <FaBookOpen />;
      case 'quiz':
        return <FaCheck />;
      case 'badge':
        return <FaMedal />;
      default:
        return <FaBookOpen />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const badgesWithIcons = Object.entries(badges).map(([id, badge]) => ({
    ...badge,
    id,
    icon: badge.icon || <FaMedal />
  }));

  const unlockedBadges = badgesWithIcons.filter(badge => badge.unlocked);
  const recentBadges = unlockedBadges
    .filter(badge => badge.unlockedAt && Date.now() - badge.unlockedAt < 604800000)
    .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));

  const exploreCourses = [
    {
      id: 'html-basics',
      title: 'HTML & CSS Basics',
      description: 'Learn the fundamentals of web development',
      progress: 0,
      icon: <FaHtml5 />,
      totalLessons: 40
    }
    // Add more courses
  ];

  return (
    <>
      <Navbar
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      <Container>
        <Content>
          {recentBadges.length > 0 && (
            <BadgeShowcase>
              <SectionTitle style={{ color: 'white' }}>
                Recently Unlocked Badges
                <ViewAll to="/badges" style={{ color: 'white' }}>View all badges</ViewAll>
              </SectionTitle>
              <ShowcaseGrid>
                {recentBadges.map(badge => (
                  <ShowcaseBadge
                    key={badge.id}
                    badge={badge}
                    onClick={(badge) => setSelectedBadge(badge)}
                  />
                ))}
              </ShowcaseGrid>
            </BadgeShowcase>
          )}

          <RecentActivities>
            <SectionTitle>
              Recent activities
              <ViewAll to="/activities">View all</ViewAll>
            </SectionTitle>
            {recentActivities.map(activity => (
              <ActivityCard key={activity.id}>
                <ActivityIcon>{activity.icon}</ActivityIcon>
                <ActivityInfo>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityMeta>
                    <span>{activity.type}</span>
                    <span>•</span>
                    <span>{activity.course}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
                  </ActivityMeta>
                </ActivityInfo>
                <div>{activity.progress}%</div>
              </ActivityCard>
            ))}
          </RecentActivities>

          <BadgesSection>
            <SectionTitle>Your Badges</SectionTitle>
            <BadgesGrid>
              {unlockedBadges.map(badge => (
                <BadgeComponent 
                  key={badge.id} 
                  badge={badge}
                  onClick={(badge) => setSelectedBadge(badge)}
                />
              ))}
            </BadgesGrid>
          </BadgesSection>

          <ExploreSection>
            <SectionTitle>
              40+ tutorials to boost your skills
              <ViewAll to="/courses">Explore more</ViewAll>
            </SectionTitle>
            <CourseGrid>
              {exploreCourses.map(course => (
                <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                  <ActivityCard>
                    <ActivityIcon>{course.icon}</ActivityIcon>
                    <ActivityInfo>
                      <ActivityTitle>{course.title}</ActivityTitle>
                      <ActivityMeta>
                        <span>{course.totalLessons} lessons</span>
                        <span>{course.progress}% Complete</span>
                      </ActivityMeta>
                    </ActivityInfo>
                  </ActivityCard>
                </Link>
              ))}
            </CourseGrid>
          </ExploreSection>
        </Content>
      </Container>
      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
      <Footer />
    </>
  );
};

export default ProgressDashboard; 