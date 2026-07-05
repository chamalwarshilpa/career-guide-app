"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Each domain has 4 phases: skills, projects, internships, placement
const roadmaps = {
  "Data Science / Analytics": {
    skills: [
      "Python fundamentals + Pandas, NumPy",
      "SQL for querying data",
      "Statistics & probability basics",
      "Data visualization (Matplotlib/Seaborn or Power BI/Tableau)",
      "Basic machine learning concepts (regression, classification)",
    ],
    projects: [
      "Exploratory data analysis on a public dataset (Kaggle)",
      "Build a dashboard visualizing real-world data",
      "A small ML prediction project (e.g. house price, churn prediction)",
    ],
    internships: [
      "Target: Data Analyst Intern, Business Analyst Intern",
      "Build a portfolio on GitHub with your analysis notebooks",
      "Practice explaining insights from data (not just code)",
    ],
    placement: [
      "Revise SQL joins, aggregations, window functions",
      "Practice case-study style interview questions",
      "Be ready to explain your projects end-to-end in interviews",
    ],
  },
  "Software Development (SDE)": {
    skills: [
      "One language deeply: Python, Java, or C++",
      "Data Structures & Algorithms (daily practice)",
      "Git & GitHub basics",
      "Basic OOP and system design concepts",
    ],
    projects: [
      "A CLI tool or automation script",
      "A full-stack web app (frontend + backend + database)",
      "Contribute to a small open-source repo",
    ],
    internships: [
      "Target: SDE Intern, Backend/Frontend Intern",
      "Solve 100+ DSA problems (LeetCode/GFG) before applying",
      "Prepare a clean resume highlighting projects, not just coursework",
    ],
    placement: [
      "DSA mock interviews (arrays, trees, graphs, DP)",
      "System design basics for entry-level rounds",
      "Behavioral/HR round preparation",
    ],
  },
  "Web Development": {
    skills: [
      "HTML, CSS, JavaScript fundamentals",
      "A frontend framework (React recommended)",
      "A backend framework (Node.js/Express or similar)",
      "Databases (SQL or Supabase/Firebase)",
    ],
    projects: [
      "A personal portfolio website",
      "A full-stack app with authentication (like this one!)",
      "Deploy at least one project live (Vercel/Netlify)",
    ],
    internships: [
      "Target: Frontend/Backend/Full-Stack Intern",
      "Build a GitHub profile with 3-4 solid projects",
      "Learn to write a good README for each project",
    ],
    placement: [
      "JavaScript fundamentals (closures, async/await, etc.)",
      "Practice building a feature live (take-home or pair coding rounds)",
      "Be ready to discuss trade-offs in your project decisions",
    ],
  },
  "AI / Machine Learning": {
    skills: [
      "Python + NumPy/Pandas",
      "Core ML algorithms (supervised/unsupervised learning)",
      "One deep learning framework (TensorFlow or PyTorch)",
      "Basic math: linear algebra, probability, calculus intuition",
    ],
    projects: [
      "A classic ML project (image classifier, sentiment analysis)",
      "A project using a pretrained model (transfer learning)",
      "Document your experiments clearly (what worked, what didn't)",
    ],
    internships: [
      "Target: ML Intern, AI Research Intern",
      "Participate in a Kaggle competition (even a simple one)",
      "Read and summarize 2-3 ML papers relevant to your project area",
    ],
    placement: [
      "Be ready to explain model choices and evaluation metrics",
      "Practice coding rounds (still DSA-heavy at most companies)",
      "Prepare to discuss real project impact, not just accuracy numbers",
    ],
  },
  "Cybersecurity": {
    skills: [
      "Networking basics (TCP/IP, DNS, HTTP)",
      "Linux command line fundamentals",
      "Basic scripting (Python or Bash)",
      "Core concepts: encryption, authentication, common vulnerabilities",
    ],
    projects: [
      "Set up a home lab (VM-based) and practice basic pentesting on it",
      "Try beginner-friendly CTF (Capture The Flag) challenges",
      "Document a vulnerability you found and how you'd fix it",
    ],
    internships: [
      "Target: Security Analyst Intern, SOC Intern",
      "Get a foundational cert if possible (e.g. Security+, or free alternatives)",
      "Build a portfolio of CTF writeups",
    ],
    placement: [
      "Revise common attack types (SQLi, XSS, CSRF, etc.)",
      "Be ready to discuss any home-lab/CTF work in detail",
      "Basic scripting questions may come up in interviews",
    ],
  },
  "Cloud / DevOps": {
    skills: [
      "Linux fundamentals",
      "One cloud platform basics (AWS/Azure/GCP free tier)",
      "Docker basics",
      "CI/CD concepts (GitHub Actions is a good starting point)",
    ],
    projects: [
      "Deploy a simple app to the cloud manually",
      "Containerize a project using Docker",
      "Set up a basic CI/CD pipeline for one of your projects",
    ],
    internships: [
      "Target: Cloud Intern, DevOps Intern",
      "Get a foundational cloud certification if time allows",
      "Document your deployment/infra setups on GitHub",
    ],
    placement: [
      "Be ready to explain your deployment pipeline choices",
      "Basic Linux/networking questions come up often",
      "Practice explaining trade-offs (cost, scalability, uptime)",
    ],
  },
  "Mobile App Development": {
    skills: [
      "One framework: React Native or Flutter",
      "Mobile UI/UX basics",
      "API integration (connecting app to a backend)",
      "App state management basics",
    ],
    projects: [
      "A simple utility app (to-do list, expense tracker)",
      "An app that connects to a real API (weather, news, etc.)",
      "Publish a project on GitHub with screenshots/demo video",
    ],
    internships: [
      "Target: Mobile App Developer Intern",
      "Build 2-3 apps with different core features (auth, storage, API calls)",
      "Learn basic app deployment/testing flow",
    ],
    placement: [
      "Be ready to explain state management choices",
      "Practice UI-focused coding rounds",
      "General DSA basics still often apply",
    ],
  },
  "Undecided / Exploring": {
    skills: [
      "Try short intro projects across 2-3 domains (web, data, AI)",
      "Take one foundational programming course seriously",
      "Talk to seniors/mentors about what excites you day-to-day",
    ],
    projects: [
      "One tiny project in each domain you're curious about",
      "Notice which one you enjoyed building the most — that's a signal",
    ],
    internships: [
      "It's okay to not apply yet — focus on picking a direction first",
      "Once you lean toward one domain, revisit this roadmap for it",
    ],
    placement: [
      "Not applicable yet — come back once you've picked a direction",
    ],
  },
};

function matchDomain(goal) {
  const g = (goal || "").toLowerCase();
  if (g.includes("data")) return "Data Science / Analytics";
  if (g.includes("ml") || g.includes("machine learning") || g.includes("ai")) return "AI / Machine Learning";
  if (g.includes("sde") || g.includes("software") || g.includes("developer")) return "Software Development (SDE)";
  if (g.includes("web")) return "Web Development";
  if (g.includes("security") || g.includes("cyber")) return "Cybersecurity";
  if (g.includes("cloud") || g.includes("devops")) return "Cloud / DevOps";
  if (g.includes("mobile") || g.includes("app dev") || g.includes("android") || g.includes("ios")) return "Mobile App Development";
  return "Undecided / Exploring";
}

const phaseLabels = {
  skills: "1. Build These Skills",
  projects: "2. Build These Projects",
  internships: "3. Internship Prep",
  placement: "4. Placement Prep",
};

export default function Roadmap() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) setStudent(data[0]);
      setLoading(false);
    }
    fetchLatest();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p>No profile found. Please fill the onboarding form first.</p>
      </main>
    );
  }

  const domain = matchDomain(student.goal);
  const plan = roadmaps[domain];

  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Your Roadmap</h1>
      <p className="text-gray-600 mb-8">
        Matched domain: <strong>{domain}</strong> (based on goal: "{student.goal}")
      </p>

      {Object.entries(plan).map(([phase, items]) => (
        <div key={phase} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{phaseLabels[phase]}</h2>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 border rounded-lg p-3">
                <span className="text-gray-400 font-bold">{i + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}