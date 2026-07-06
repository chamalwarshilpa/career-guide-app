"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b px-4 py-3 flex gap-6 items-center">
      <Link href="/" className="font-bold">CareerPath AI</Link>
      <Link href="/onboarding" className="text-sm text-gray-600 hover:text-black">
        Onboarding
      </Link>
      <Link href="/roadmap" className="text-sm text-gray-600 hover:text-black">
        Roadmap
      </Link>
      <Link href="/students" className="text-sm text-gray-600 hover:text-black">
        All Profiles
      </Link>
      <Link href="/tracker" className="text-sm text-grey-600 hover:text-black">
      Skill Tracker
      </Link>
    </nav>
  );
}