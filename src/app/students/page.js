"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setStudents(data);
      }
      setLoading(false);
    }

    fetchStudents();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submitted Profiles</h1>

      {students.length === 0 && <p>No profiles yet.</p>}

      <div className="space-y-4">
        {students.map((s) => (
          <div key={s.id} className="border rounded-lg p-4">
            <p><strong>Year:</strong> {s.year}</p>
            <p><strong>Branch:</strong> {s.branch}</p>
            <p><strong>Goal:</strong> {s.goal}</p>
            <p><strong>Skills:</strong> {s.skills}</p>
          </div>
        ))}
      </div>
    </main>
  );
}