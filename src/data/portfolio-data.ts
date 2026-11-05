/**
 * Portfolio Data
 * Single source of truth for all portfolio content
 */

import type {
  PersonalInfo,
  Experience,
  Education,
  Language,
  SkillCategory,
} from "@/types/portfolio";

// ===== Portfolio Data =====

export const personalInfo: PersonalInfo = {
  name: "Elena Voss",
  title: "WRITER & CONSULTANT",
  location: { city: "Brooklyn, New York", country: "USA" },
  website: "www.elenavoss.co",
  email: "hello@elenavoss.co",
  phone: "347-555-0192",
  avatar: "https://images.pexels.com/photos/4491490/pexels-photo-4491490.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  bio: "I help brands find their voice. With 12 years crafting narratives for startups, Fortune 500s, and everything in between, I transform complex ideas into stories that resonate. My work spans brand strategy, content systems, and creative consulting—always with the belief that the right words can change everything.",
  skills: "Brand Strategy, Storytelling, Content Systems, Creative Direction, Workshop Facilitation, Editorial Strategy, Copywriting, Brand Voice, Narrative Design, Strategic Consulting",
};

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "Independent",
    role: "Brand Strategist & Writer",
    location: "Brooklyn, NY",
    startDate: "2020-01",
    endDate: null,
    description: "Working with founders, agencies, and creative teams to shape brand narratives. Recent clients include a climate tech startup (Series B), a heritage fashion house, and a James Beard-nominated restaurant group. I lead naming projects, develop voice guidelines, and write the words that matter most.",
    current: true,
  },
  {
    id: "exp-2",
    company: "Wieden+Kennedy",
    role: "Senior Copywriter",
    location: "New York, NY",
    startDate: "2016-03",
    endDate: "2019-12",
    description: "Crafted campaigns for Nike, Coca-Cola, and Airbnb. Led a team of three writers on the Nike Women's account, producing work that earned a Cannes Lion and a One Show pencil. Developed long-form editorial content and brand manifestos that shaped global messaging strategies.",
    current: false,
  },
  {
    id: "exp-3",
    company: "McSweeney's",
    role: "Associate Editor",
    location: "San Francisco, CA",
    startDate: "2013-06",
    endDate: "2016-02",
    description: "Edited fiction and nonfiction for the quarterly journal and website. Managed relationships with emerging writers, commissioned essays, and helped shape the editorial voice that McSweeney's is known for. Published my own short fiction during this time.",
    current: false,
  },
  {
    id: "exp-4",
    company: "The Paris Review",
    role: "Editorial Assistant",
    location: "New York, NY",
    startDate: "2011-09",
    endDate: "2013-05",
    description: "First reader for fiction submissions, fact-checker for interviews, and occasional contributor to the Daily. Learned the craft of editing from masters and developed a deep appreciation for the sentence.",
    current: false,
  },
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "Columbia University",
    degree: "Master of Fine Arts",
    field: "Creative Writing",
    startYear: "2009",
    endYear: "2011",
    location: "New York, NY",
    details: "Fiction concentration. Thesis advised by Ben Marcus.",
  },
  {
    id: "edu-2",
    institution: "University of Michigan",
    degree: "Bachelor of Arts",
    field: "English Literature & French",
    startYear: "2005",
    endYear: "2009",
    location: "Ann Arbor, MI",
    details: "Hopwood Award for Short Fiction",
  },
];

export const languages: Language[] = [
  { language: "English", proficiency: "Native" },
  { language: "French", proficiency: "Fluent" },
  { language: "Spanish", proficiency: "Conversational" },
  { language: "Italian", proficiency: "Reading" },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Writing",
    skills: "Brand Copywriting, Long-form Editorial, Manifestos, Naming, Taglines, Tone of Voice",
  },
  {
    category: "Strategy",
    skills: "Brand Positioning, Audience Research, Messaging Architecture, Content Systems",
  },
  {
    category: "Collaboration",
    skills: "Workshop Facilitation, Creative Direction, Client Presentations, Team Leadership",
  },
];
