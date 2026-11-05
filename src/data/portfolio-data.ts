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
  Project,
  Certificate,
  SocialLink,
} from "@/types/portfolio";

// ===== Portfolio Data =====

export const personalInfo: PersonalInfo = {
  name: "Htet Aung Lin",
  title: "AI STUDENT & ML ENGINEER",
  location: { city: "Deggendorf", country: "Germany" },
  website: "github.com/hal2512",
  email: "htetaunglin2512@gmail.com",
  phone: "",
  avatar: "",
  bio: "I'm a B.Sc. Artificial Intelligence student at TH Deggendorf (expected graduation 03/2028) who builds machine-learning models on real data, most recently a next-drink prediction model for BSH trained on 83M+ events. Before AI, I studied medicine and co-founded a food-delivery startup as its lead software engineer. I'm looking for a working-student role or my mandatory internship in ML or data science, and I can start immediately.",
  skills: "Python, Machine Learning, Computer Vision, Deep Learning, Data Engineering, Flutter",
};

export const socialLinks: SocialLink[] = [
  { platform: "LinkedIn", username: "htetaung-lin", url: "https://www.linkedin.com/in/htetaung-lin" },
  { platform: "GitHub", username: "hal2512", url: "https://github.com/hal2512" },
];

export const projects: Project[] = [
  {
    id: "bsh-next-cup-prediction",
    name: "Next-Cup Prediction",
    period: "03/2026 – 07/2026",
    context: "Industry project with BSH",
    description: "Team project: I owned the EDA, feature engineering and modelling pipeline. The model predicts a user's next drink from 83M+ records across over 210k devices: 70% top-1 and 94% top-3 accuracy, versus 60% / 76.5% for the machine's current last-drink default.",
    techStack: ["Python", "LightGBM", "Polars", "DuckDB", "Parquet", "scikit-learn"],
    status: "archived",
  },
  {
    id: "iot-intrusion-detection",
    name: "IoT Network Intrusion Detection",
    period: "03/2026 – 07/2026",
    context: "University group project · Deep Learning & Big Data",
    description: "Built a multi-layer perceptron from scratch in PyTorch to classify IoT network traffic (RT-IoT2022, 123K flows) as normal or one of 9 attack types. Handled a 3,380:1 class imbalance with tuned SMOTE. 99.7% binary accuracy and 99.5% accuracy on 12 classes.",
    techStack: ["Python", "PyTorch", "scikit-learn", "SMOTE"],
    status: "archived",
  },
  {
    id: "diabetes-risk-prediction",
    name: "Diabetes Risk Prediction",
    period: "04/2026 – 07/2026",
    context: "University ML project · team of 2",
    description: "Predicted diabetes status (healthy / prediabetic / diabetic) from 253,680 CDC health-survey records with a 46:1 class imbalance. Showed why accuracy misleads here, found that a 5-question, no-lab feature subset keeps ~96% of performance, and reached ROC-AUC 0.82 on healthy vs. at-risk.",
    techStack: ["Python", "scikit-learn", "pandas", "Logistic Regression", "Random Forest", "SVM"],
    status: "archived",
  },
  {
    id: "hand-gesture-tetris",
    name: "Hand-Gesture Controlled Tetris",
    period: "03/2025 – 07/2025",
    context: "Computer vision university project · team of 2",
    description: "Designed and trained a custom hand-gesture recognition model on normalised landmark features for low-latency control, and connected it to a Tetris game loop running at standard webcam frame rates.",
    techStack: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
    githubUrl: "https://github.com/hal2512/hand-gesture-tetris",
    status: "archived",
  },
  {
    id: "habit-tracker",
    name: "Habit Tracker & Recommendation",
    period: "2025",
    context: "Assistance Systems university project",
    description: "A habit-tracking web app with a recommendation component, backed by a FastAPI service with unit and integration tests and Docker for reproducible builds.",
    techStack: ["React", "Node.js", "MongoDB", "FastAPI", "PyTest", "Docker"],
    githubUrl: "https://github.com/hal2512/habit_tracker_and_recommendation",
    status: "archived",
  },
  {
    id: "cashsplit",
    name: "CashSplit",
    period: "07/2026 – Present",
    context: "Solo mobile app",
    description: "A Flutter app for friend groups to log shared expenses per gathering and settle up. Its settlement algorithm needs at most n−1 transfers with exact cent accuracy, checked with 20,000+ randomised tests.",
    techStack: ["Flutter", "Dart", "Firebase", "Cloud Firestore"],
    githubUrl: "https://github.com/hal2512/split_bill",
    status: "active",
  },
];

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "University of Medicine 2, Yangon",
    role: "Lab Assistant & Data Scientist",
    location: "Yangon, Myanmar",
    startDate: "2021-07",
    endDate: "2021-12",
    description: "Searched databases for target proteins and collected the related data, ran exploratory data analysis and chemical space analysis, and calculated molecular features and descriptors for further analysis.",
    current: false,
  },
  {
    id: "exp-2",
    company: "Deli Rush",
    role: "Co-founder & Lead Software Engineer",
    location: "Yangon, Myanmar",
    startDate: "2021-01",
    endDate: "2021-12",
    description: "Co-founded a food delivery startup and built all of its software myself: a customer app and a shop-management app in Flutter, with a Firebase backend.",
    current: false,
  },
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "Technische Hochschule Deggendorf",
    degree: "B.Sc.",
    field: "Artificial Intelligence",
    startYear: "2023",
    endYear: "03/2028 (expected)",
    location: "Deggendorf, Germany",
    details: "Includes a mandatory internship (Pflichtpraktikum) and the bachelor's thesis.",
  },
  {
    id: "edu-2",
    institution: "Pearson Edexcel",
    degree: "International A-Levels",
    field: "Mathematics, Physics & Biology",
    startYear: "2022",
    endYear: "2022",
    location: "Yangon, Myanmar",
    details: "Taken for admission to a German university, as my medical university could not issue a mark transcript.",
  },
  {
    id: "edu-3",
    institution: "University of Medicine 2, Yangon",
    degree: "M.B.B.S.",
    field: "Medicine & Surgery",
    startYear: "2015",
    endYear: "2020",
    location: "Yangon, Myanmar",
    details: "Studied until the final year.",
  },
];

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    name: "IBM Data Science Professional Certificate",
    issuer: "IBM",
    details: "12-course series covering Python, SQL databases, data visualization, machine learning, and applied project work.",
  },
  { id: "cert-2", name: "Supervised Learning with scikit-learn" },
  { id: "cert-3", name: "Unsupervised Learning with Python" },
  { id: "cert-4", name: "Big Data Fundamentals with PySpark" },
];

export const languages: Language[] = [
  { language: "English", proficiency: "C1" },
  { language: "German", proficiency: "A2 (certified) · learning B1" },
  { language: "Burmese", proficiency: "Native" },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Machine learning",
    skills: "PyTorch, scikit-learn, LightGBM, TensorFlow, OpenCV, MediaPipe",
  },
  {
    category: "Data",
    skills: "Python, SQL, pandas, NumPy, Polars, DuckDB, Parquet, matplotlib",
  },
  {
    category: "Software & tools",
    skills: "Git, Docker, Linux, FastAPI, Flutter (Dart), Firebase",
  },
];
