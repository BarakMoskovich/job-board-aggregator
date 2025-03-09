import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  email: string;
  passwordHash: string;
  name: string;
  preferences: {
    jobTitles: string[];
    locations: string[];
    salaryRange: {
      min: number;
      max: number;
    };
    notificationPreferences: {
      email: boolean;
      push: boolean;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  description: string;
  source: string;
  postedAt: Timestamp;
  expiresAt: Timestamp;
  url: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Application {
  _id: string;
  userId: string;
  jobId: string;
  status: string;
  appliedAt?: Timestamp;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Scraper {
  _id: string;
  source: string;
  status: string;
  lastRunAt: Timestamp;
  nextRunAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  jobId: string;
  read: boolean;
  sentAt: Timestamp;
  createdAt: Timestamp;
}

export interface Log {
  _id: string;
  level: string;
  message: string;
  timestamp: Timestamp;
  metadata?: {
    userId?: string;
    jobId?: string;
    source?: string;
  };
}
