"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const roadmaps = {
  "Data Science / Analytics": ["Python fundamentals + Pandas, NumPy", "SQL for querying data", "Statistics & probability basics", "Data visualization (Matplotlib/Seaborn or Power BI/Tableau)", "Basic machine learning concepts (regression, classification)"],
  "Software Development (SDE)": ["One language deeply: Python, Java, or C++", "Data Structures & Algorithms (daily practice)", "Git & GitHub basics", "Basic OOP and system design concepts"],
  "Web Development": ["HTML, CSS, JavaScript fundamentals", "A frontend framework (React recommended)", "A backend framework (Node.js/Express or similar)", "Databases (SQL or Supabase/Firebase)"],
  "AI / Machine Learning": ["Python + NumPy/Pandas", "Core ML algorithms (supervised/unsupervised learning)", "One deep learning framework (TensorFlow or PyTorch)", "Basic math: linear algebra, probability, calculus intuition"],
  "Cybersecurity": ["Networking basics (TCP/IP, DNS, HTTP)", "Linux command line fundamentals", "Basic scripting (Python or Bash)", "Core concepts: encryption, authentication, common vulnerabilities"],
  "Cloud / DevOps": ["Linux fundamentals", "One cloud platform basics (AWS/Azure/GCP free tier)", "Docker basics", "CI/CD concepts (GitHub Actions is a good starting point)"],
  "Mobile App Development": ["One framework: React Native or Flutter", "Mobile UI/UX basics", "API integration (connecting app to a backend)", "App state management basics"],
  "Undecided / Exploring": ["Try short intro projects across 2-3 domains (web, data, AI)", "Take one foundational programming course seriously", "Talk to seniors/mentors about what excites you day-to-day"],
};

export default function Tracker() {
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setup() {
      const { data: students } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!students || students.length === 0) {
        setLoading(false);
        return;
      }

      const currentStudent = students[0];
      setStudent(currentStudent);

      const skillList = roadmaps[currentStudent.goal] || roadmaps["Undecided / Exploring"];

      const { data: existing } = await supabase
        .from("skill_progress")
        .select("*")
        .eq("student_id", currentStudent.id);

      if (!existing || existing.length === 0) {
        const rows = skillList.map((skill) => ({
          student_id: currentStudent.id,
          skill_name: skill,
          completed: false,
        }));
        const { data: inserted } = await supabase
          .from("skill_progress")
          .insert(rows)
          .select();
        setProgress(inserted || []);
      } else {
        setProgress(existing);
      }

      setLoading(false);
    }

    setup();
  }, []);

  async function toggleSkill(id, currentStatus) {
    const { error } = await supabase
      .from("skill_progress")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (!error) {
      setProgress((prev) =>
        prev.map((p) => (p.id === id ? { ...p, completed: !currentStatus } : p))
      );
    }
  }

  if (loading) return <p className="p-8">Loading...</p>;

  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p>No profile found. Please fill the onboarding form first.</p>
      </main>
    );
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const totalCount = progress.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Skill Tracker</h1>
      <p className="text-gray-600 mb-6">
        Domain: <strong>{student.goal}</strong>
      </p>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-black h-3 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedCount} / {totalCount} skills completed ({percent}%)
        </p>
      </div>

      <div className="space-y-2">
        {progress.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={p.completed}
              onChange={() => toggleSkill(p.id, p.completed)}
              className="w-5 h-5"
            />
            <span className={p.completed ? "line-through text-gray-400" : ""}>
              {p.skill_name}
            </span>
          </label>
        ))}
      </div>
    </main>
  );
}