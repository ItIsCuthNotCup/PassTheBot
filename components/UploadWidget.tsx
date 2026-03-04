"use client";

import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";

type InputMode = "upload" | "paste";

export default function UploadWidget() {
  const [mode, setMode] = useState<InputMode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Please upload a PDF file.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!jobTitle.trim()) {
      setError("Please enter the job title you're targeting.");
      return;
    }

    if (mode === "upload" && !file) {
      setError("Please upload your resume PDF.");
      return;
    }

    if (mode === "paste" && pastedText.trim().length < 100) {
      setError("Please paste your full resume text (at least 100 characters).");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("jobTitle", jobTitle.trim());
      if (mode === "upload" && file) {
        formData.append("file", file);
      } else {
        formData.append("resumeText", pastedText.trim());
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed. Please try again.");
      }

      router.push(`/results/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Job title */}
      <div>
        <label className="block text-sm font-medium text-navy-300 mb-1.5">
          Target Job Title
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior React Engineer, Staff Software Engineer"
          className="w-full bg-navy-800 border border-navy-600 text-white placeholder-navy-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-500 transition-colors"
        />
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg overflow-hidden border border-navy-600">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mode === "upload"
              ? "bg-accent-600 text-white"
              : "bg-navy-800 text-navy-400 hover:text-white"
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mode === "paste"
              ? "bg-accent-600 text-white"
              : "bg-navy-800 text-navy-400 hover:text-white"
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* Upload area */}
      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-accent-400 bg-accent-900/20"
              : file
              ? "border-accent-600 bg-accent-900/10"
              : "border-navy-600 hover:border-navy-500"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setFile(f); setError(""); }
            }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📄</span>
              <span className="text-accent-400 font-medium text-sm">{file.name}</span>
              <span className="text-navy-500 text-xs">
                {(file.size / 1024).toFixed(1)} KB — click to change
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">⬆️</span>
              <div>
                <p className="text-white font-medium text-sm">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-navy-500 text-xs mt-1">PDF only · max 5 MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your full resume text here..."
          rows={10}
          className="w-full bg-navy-800 border border-navy-600 text-white placeholder-navy-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-500 transition-colors resize-none font-mono"
        />
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent-500 hover:bg-accent-400 disabled:bg-accent-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing resume...
          </>
        ) : (
          "Scan My Resume — Free"
        )}
      </button>
      <p className="text-center text-navy-500 text-xs">
        No account required · Your resume is never stored
      </p>
    </form>
  );
}
