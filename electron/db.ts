import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import crypto from 'node:crypto'

const dbPath = path.join(app.getPath('userData'), app.isPackaged ? '12week.db' : '12week-dev.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

export function initDB() {
  // Cycles
  db.exec(`
    CREATE TABLE IF NOT EXISTS cycles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT CHECK(status IN ('active', 'archived', 'planned')) NOT NULL DEFAULT 'planned',
      final_score REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Projects
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      cycle_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      color TEXT,
      icon TEXT,
      start_date TEXT,
      end_date TEXT,
      priority TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
    )
  `)

  // Migration: Add icon column if it doesn't exist
  try {
    db.prepare('ALTER TABLE projects ADD COLUMN icon TEXT').run()
  } catch (error) {
    // Column likely already exists
  }

  // Migration: Add metadata columns if they don't exist
  try {
    db.prepare('ALTER TABLE projects ADD COLUMN start_date TEXT').run()
  } catch (error) { }
  try {
    db.prepare('ALTER TABLE projects ADD COLUMN end_date TEXT').run()
  } catch (error) { }
  try {
    db.prepare('ALTER TABLE projects ADD COLUMN priority TEXT').run()
  } catch (error) { }
  try {
    db.prepare('ALTER TABLE projects ADD COLUMN sort_order INTEGER DEFAULT 0').run()
  } catch (error) { }

  try {
    db.prepare('ALTER TABLE tasks ADD COLUMN priority TEXT').run()
  } catch (error) { }

  try {
    db.prepare('ALTER TABLE tasks ADD COLUMN description TEXT').run()
  } catch (error) { }

  // Tasks
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      week_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_completed INTEGER DEFAULT 0,
      due_date TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `)

  // Reviews
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      cycle_id TEXT NOT NULL,
      week_number INTEGER NOT NULL,
      content TEXT,
      rating INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
    )
  `)


  // Documents
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents(
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'vision', 'project_note'
      related_id TEXT, -- null for vision, project_id for notes
      content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Seed Data if empty
  const cycleCount = db.prepare('SELECT COUNT(*) as count FROM cycles').get() as any
  if (cycleCount.count === 0) {
    const cycleId = crypto.randomUUID()
    const projectId1 = crypto.randomUUID()
    const projectId2 = crypto.randomUUID()

    // Create Cycle
    db.prepare(`
      INSERT INTO cycles(id, title, start_date, end_date, status)
  VALUES(?, ?, ?, ?, ?)
    `).run(cycleId, '2024 Q4', new Date().toISOString(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), 'active')

    // Create Projects
    db.prepare(`
      INSERT INTO projects(id, cycle_id, title, description, color, icon)
  VALUES(?, ?, ?, ?, ?, ?)
    `).run(projectId1, cycleId, 'Launch MVP', 'Build the 12-week year app', '#4F46E5', 'RocketLaunch')

    db.prepare(`
      INSERT INTO projects(id, cycle_id, title, description, color, icon)
  VALUES(?, ?, ?, ?, ?, ?)
    `).run(projectId2, cycleId, 'Fitness Goal', 'Run 5k every week', '#10B981', 'Sneaker')

    // Create Tasks
    const insertTask = db.prepare(`
      INSERT INTO tasks(id, project_id, week_number, title, is_completed)
  VALUES(?, ?, ?, ?, ?)
    `)

    insertTask.run(crypto.randomUUID(), projectId1, 1, 'Setup Project', 1)
    insertTask.run(crypto.randomUUID(), projectId1, 1, 'Design DB', 1)
    insertTask.run(crypto.randomUUID(), projectId1, 1, 'Implement UI', 0)

    insertTask.run(crypto.randomUUID(), projectId2, 1, 'Run 5km', 1)
    insertTask.run(crypto.randomUUID(), projectId2, 1, 'Gym Session', 0)
  }
}

export default db
