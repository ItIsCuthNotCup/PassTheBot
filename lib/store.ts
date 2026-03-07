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

// UUID v4 regex for input validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

// Keep an in-memory cache to avoid redundant DB reads in the same process.
// Bounded to prevent unbounded memory growth.
const MAX_CACHE_SIZE = 500;
const cache = new Map<string, ScanResult>();

function setCached(id: string, result: ScanResult): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    // Evict the oldest entry (Map preserves insertion order)
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(id, result);
}

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
    );
    CREATE TABLE IF NOT EXISTS processed_webhook_events (
      event_id TEXT PRIMARY KEY,
      processed_at INTEGER NOT NULL
    );
  `);
  return db;
}

export function saveScan(result: ScanResult): void {
  const db = getDb();
  try {
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
    setCached(result.id, result);
  } finally {
    db.close();
  }
}

export function getScan(id: string): ScanResult | null {
  if (!isValidUUID(id)) return null;

  if (cache.has(id)) {
    return cache.get(id)!;
  }
  const db = getDb();
  try {
    const row = db
      .prepare("SELECT result_json, paid FROM scans WHERE id = ?")
      .get(id) as { result_json: string; paid: number } | undefined;
    if (!row) return null;
    let result: ScanResult;
    try {
      result = JSON.parse(row.result_json);
    } catch {
      return null;
    }
    result.paid = row.paid === 1;
    setCached(id, result);
    return result;
  } finally {
    db.close();
  }
}

export function markPaid(id: string): void {
  if (!isValidUUID(id)) return;
  const db = getDb();
  try {
    db.prepare("UPDATE scans SET paid = 1 WHERE id = ?").run(id);
  } finally {
    db.close();
  }
  const cached = cache.get(id);
  if (cached) {
    cached.paid = true;
    cache.set(id, cached);
  }
}

/** Returns true if this Stripe event ID has already been processed. */
export function isEventProcessed(eventId: string): boolean {
  const db = getDb();
  try {
    const row = db
      .prepare("SELECT 1 FROM processed_webhook_events WHERE event_id = ?")
      .get(eventId);
    return !!row;
  } finally {
    db.close();
  }
}

/** Records a Stripe event ID as processed to prevent duplicate handling. */
export function markEventProcessed(eventId: string): void {
  const db = getDb();
  try {
    db.prepare(
      "INSERT OR IGNORE INTO processed_webhook_events (event_id, processed_at) VALUES (?, ?)"
    ).run(eventId, Date.now());
  } finally {
    db.close();
  }
}
