import { Associate, Category, Vote } from './types';

export const COLORS = {
  primary: '#0000A0', // Mars Blue
  secondary: '#b98c52', // Mars Gold
  accent: '#ff6400', // Mars Orange
};

export const CATEGORIES: Category[] = [
  {
    id: 'c1',
    title: 'Customer Obsession',
    description: 'Going above and beyond to delight our customers and partners.',
    icon: 'HeartHandshake'
  },
  {
    id: 'c2',
    title: 'Innovation Champion',
    description: 'Thinking outside the box to drive efficiency and new ideas.',
    icon: 'Lightbulb'
  },
  {
    id: 'c3',
    title: 'Quality First',
    description: 'Unwavering commitment to the highest standards of quality.',
    icon: 'ShieldCheck'
  },
  {
    id: 'c4',
    title: 'Collaboration Hero',
    description: 'Breaking silos and working effectively across teams.',
    icon: 'Users'
  },
  {
    id: 'c5',
    title: 'Inspiring Leadership',
    description: 'Leading by example and empowering others to succeed.',
    icon: 'Award'
  }
];

// Kept for type compatibility if needed, but the app now allows any nominee.
export const ASSOCIATES: Associate[] = [
  { id: 'a1', name: 'Sarah Chen', department: 'R&D', location: 'Singapore', avatarUrl: 'https://picsum.photos/100/100?random=1' },
  { id: 'a2', name: 'Raj Patel', department: 'Supply Chain', location: 'India', avatarUrl: 'https://picsum.photos/100/100?random=2' },
];

// Seed some initial votes with manual details
export const INITIAL_VOTES: Vote[] = [
  { id: 'v1', nomineeName: 'Sarah Chen', nomineeDepartment: 'R&D', nomineeLocation: 'Singapore', categoryId: 'c2', nominatorName: 'System', reason: 'Great work on the new flavor launch.', timestamp: Date.now() - 100000 },
  { id: 'v2', nomineeName: 'Sarah Chen', nomineeDepartment: 'R&D', nomineeLocation: 'Singapore', categoryId: 'c2', nominatorName: 'System', reason: 'Innovative thinking.', timestamp: Date.now() - 90000 },
  { id: 'v3', nomineeName: 'Raj Patel', nomineeDepartment: 'Supply Chain', nomineeLocation: 'India', categoryId: 'c1', nominatorName: 'System', reason: 'Solved the delivery crisis.', timestamp: Date.now() - 80000 },
  { id: 'v4', nomineeName: 'Mei Ling', nomineeDepartment: 'Marketing', nomineeLocation: 'China', categoryId: 'c4', nominatorName: 'System', reason: 'Cross-market synergy expert.', timestamp: Date.now() - 70000 },
  { id: 'v5', nomineeName: 'Mei Ling', nomineeDepartment: 'Marketing', nomineeLocation: 'China', categoryId: 'c4', nominatorName: 'System', reason: 'Always helpful.', timestamp: Date.now() - 60000 },
  { id: 'v6', nomineeName: 'Mei Ling', nomineeDepartment: 'Marketing', nomineeLocation: 'China', categoryId: 'c5', nominatorName: 'System', reason: 'Natural leader.', timestamp: Date.now() - 50000 },
];

export const DEPARTMENTS = ['Sales', 'CBU', 'R&D', 'Supply Chain', 'P&O', 'Finance', 'Digital Technologies', 'Commercial', 'Corporate Affairs', 'DCOM', 'Other'];
export const LOCATIONS = ['South Korea', 'Hong Kong', 'Taiwan', 'Malaysia', 'Singapore', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Other'];
