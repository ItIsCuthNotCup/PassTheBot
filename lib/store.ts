/**
 * Simple in-memory + SQLite store for scan results.
 * We NEVER store resume text — only the JSON analysis output + UUID.
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface ScanResult {
  id: string;
  jobTitle: string;
  overallScore: number;
  categories: {
    keywordMatch: CategoryResult;
    formatting: CategoryResult;
    achievements: CategoryResult;
    skillsSection: CategoryResult;
    structure: CategoryResult;
    actionVerbs: CategoryResult;
  };
  paid: boolean;
  createdAt: number;
}

export interface CategoryResult {
  score: number;
  suggestions: string[];
}

// Keep an in-memory cache to avoid redundant DB reads in the same process
const cache = new Map<string, ScanResult>();

function getDb(): Database.Database {
  const dbDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const db = new Database(path.join(dbDir, "scans.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      job_title TEXT NOT NULL,
      result_json TEXT NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);
  return db;
}

export function saveScan(result: ScanResult): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO scans (id, job_title, result_json, paid, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    result.id,
    result.jobTitle,
    JSON.stringify(result),
    result.paid ? 1 : 0,
    result.createdAt
  );
  cache.set(result.id, result);
  db.close();
}

export function getScan(id: string): ScanResult | null {
  if (cache.has(id)) {
    return cache.get(id)!;
  }
  const db = getDb();
  const row = db
    .prepare("SELECT result_json, paid FROM scans WHERE id = ?")
    .get(id) as { result_json: string; paid: number } | undefined;
  db.close();
  if (!row) return null;
  const result: ScanResult = JSON.parse(row.result_json);
  result.paid = row.paid === 1;
  cache.set(id, result);
  return result;
}

export function markPaid(id: string): void {
  const db = getDb();
  db.prepare("UPDATE scans SET paid = 1 WHERE id = ?").run(id);
  db.close();
  const cached = cache.get(id);
  if (cached) {
    cached.paid = true;
    cache.set(id, cached);
  }
}
