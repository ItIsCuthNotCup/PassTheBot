import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <h1 className="text-6xl font-extrabold text-white">404</h1>
        <p className="text-navy-400 text-lg">
          This page doesn&apos;t exist — or your scan result has expired.
        </p>
        <Link
          href="/"
          className="bg-accent-500 hover:bg-accent-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Scan a new resume
        </Link>
      </main>
    </div>
  );
}
