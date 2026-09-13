export type Language = 'en' | 'es';

export interface ServiceItem {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  problemSolved: string;
  features: string[];
  benefits: { title: string; desc: string }[];
  process: { step: string; title: string; description: string }[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  deliverable: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  location: string;
  summary: string;
  challenge: string;
  solution: string;
  architecture: string[];
  results: { metric: string; label: string }[];
  tags: string[];
  quote?: { text: string; author: string; role: string };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
}

export interface HollowmoonOSNode {
  id: string;
  label: string;
  type: 'input' | 'process' | 'ai' | 'storage' | 'output';
  status: 'active' | 'syncing' | 'idle';
  description: string;
  metrics: string;
}

export interface BookingSubmission {
  id: string;
  fullName: string;
  email: string;
  company: string;
  role: string;
  serviceInterest: string;
  budgetRange: string;
  timeline: string;
  challenges: string[];
  notes: string;
  scheduledDate: string;
  scheduledTime: string;
  submittedAt: string;
}
