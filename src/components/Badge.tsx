import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Badge as BadgeType } from '../types/badge';

interface BadgeProps {
  badge: BadgeType;
  onClick?: (badge: BadgeType) => void;
}

const unlockAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #6c63ff; }
  50% { box-shadow: 0 0 20px #6c63ff; }
  100% { box-shadow: 0 0 5px #6c63ff; }
`;

const BadgeWrapper = styled.div<{ $unlocked: boolean; $new: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  opacity: ${props => props.$unlocked ? 1 : 0.5};
  transition: all 0.3s ease;
  cursor: pointer;
  
  ${props => props.$new && `
    animation: ${unlockAnimation} 0.5s ease-out,
               ${glowAnimation} 2s infinite;
  `}

  &:hover {
    transform: ${props => props.$unlocked ? 'translateY(-5px)' : 'none'};
    box-shadow: ${props => props.$unlocked ? '0 5px 15px rgba(108, 99, 255, 0.2)' : 'none'};
  }
`;

const BadgeIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: #f0f4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c63ff;
  font-size: 24px;
`;

const BadgeTitle = styled.h4`
  font-size: 14px;
  color: #1f2937;
  margin-bottom: 4px;
`;

const BadgeDescription = styled.p`
  font-size: 12px;
  color: #6b7280;
`;

const ProgressIndicator = styled.div`
  font-size: 12px;
  color: #6c63ff;
  margin-top: 8px;
`;

export const Badge: React.FC<BadgeProps> = ({ badge, onClick }) => {
  const isNew = badge.unlockedAt ? Date.now() - badge.unlockedAt < 86400000 : false;
  
  return (
    <BadgeWrapper 
      $unlocked={badge.unlocked} 
      $new={isNew}
      onClick={() => onClick?.(badge)}
    >
      <BadgeIcon>{badge.icon}</BadgeIcon>
      <BadgeTitle>{badge.title}</BadgeTitle>
      <BadgeDescription>{badge.description}</BadgeDescription>
      {badge.progress !== undefined && !badge.unlocked && (
        <ProgressIndicator>
          {Math.round(badge.progress)}% Complete
        </ProgressIndicator>
      )}
    </BadgeWrapper>
  );
}; 