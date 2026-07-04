import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">CareerPath AI</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Personalized career guidance, skill roadmaps, and placement prep —
        built for tech students at any stage of college.
      </p>
      <Link
        href="/onboarding"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Get Started
      </Link>
    </main>
  );
}