"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    year: "",
    branch: "",
    goal: "",
    skills: "",
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Saving...");

    const { error } = await supabase.from("students").insert([formData]);

    if (error) {
      console.error(error);
      setStatus("Something went wrong. Check the console.");
    } else {
      setStatus("Saved successfully! Redirecting...");
      setTimeout(() => {
        router.push("/roadmap");
      }, 1000);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Tell us about you</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <select name="year" onChange={handleChange} className="w-full border rounded p-3">
          <option value="">Select your year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>

        <input
          name="branch"
          onChange={handleChange}
          placeholder="Your branch (e.g. CSE, ECE, IT)"
          className="w-full border rounded p-3"
        />

        <input
          name="goal"
          onChange={handleChange}
          placeholder="Career goal (e.g. SDE, Data Science, undecided)"
          className="w-full border rounded p-3"
        />

        <textarea
          name="skills"
          onChange={handleChange}
          placeholder="Current skills (e.g. Python, basic HTML/CSS)"
          className="w-full border rounded p-3"
          rows={3}
        />

        <button
          type="submit"
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
        >
          Submit
        </button>

        {status && <p className="text-center text-sm mt-2">{status}</p>}
      </form>
    </main>
  );
}