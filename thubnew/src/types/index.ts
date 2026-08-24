export type UserRole = "admin" | "author" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  subjectCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  branchSlug: string;
  description: string;
  topicCount?: number;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  subjectSlug: string;
  branchSlug: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface Quiz {
  id?: string;
  _id?: string;
  questions: QuizQuestion[];
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  branchSlug: string;
  subjectSlug: string;
  topicSlug: string;
  description: string;
  content: string; // Markdown or HTML
  author: {
    name: string;
    avatar?: string;
  };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  codeSnippets?: {
    language: string;
    code: string;
  }[];
  videoUrl?: string;
  quiz?: Quiz;
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
}

export interface Bookmark {
  id: string;
  tutorialId: string;
  tutorial: Tutorial;
  createdAt: string;
}

export interface LearningProgress {
  userId: string;
  tutorialId: string;
  completed: boolean;
  score?: number;
  updatedAt: string;
}
