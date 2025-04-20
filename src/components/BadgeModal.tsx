import React from 'react';
import styled from 'styled-components';
import { Badge } from './Badge';
import { Badge as BadgeType } from '../types/badge';

interface BadgeModalProps {
  badge: BadgeType;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #1f2937;
  }
`;

const BadgeModal: React.FC<BadgeModalProps> = ({ badge, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Badge badge={badge} />
        {badge.unlocked && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Unlocked on {new Date(badge.unlockedAt!).toLocaleDateString()}</p>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default BadgeModal; 