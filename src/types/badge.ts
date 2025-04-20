import { ReactNode } from 'react';

export interface Badge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  icon: ReactNode;
  iconName?: string;
  category?: string;
} 