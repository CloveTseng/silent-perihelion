import { ipcMain } from 'electron'
import db from './db'
import crypto from 'node:crypto'

export function initIPC() {
  ipcMain.handle('get-dashboard-data', () => {
    // 1. Get Active Cycle
    const cycle = db.prepare("SELECT * FROM cycles WHERE status = 'active'").get() as any

    if (!cycle) {
      return { cycle: null, projects: [] }
    }

    // 2. Calculate Current Week
    // 2. Calculate Current Week
    const startDate = new Date(cycle.start_date)
    const now = new Date()

    // Calculate difference in milliseconds
    const diffTime = now.getTime() - startDate.getTime()

    // Convert to days (floor to handle partial days correctly from start)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    let currentWeek: number

    if (diffDays < 0) {
      // Future cycle
      currentWeek = 0
    } else {
      // Current or past cycle
      // Week 1 starts at day 0 (0-6 days = Week 1)
      currentWeek = Math.floor(diffDays / 7) + 1
    }

    if (currentWeek > 12) currentWeek = 12 // Cap at 12 or handle overflow

    console.log('IPC: get-dashboard-data - Cycle:', cycle.id, 'Current Week:', currentWeek)

    // 3. Get Projects & Progress
    const projects = db.prepare("SELECT * FROM projects WHERE cycle_id = ?").all(cycle.id) as any[]

    // Calculate progress for each project (based on completed tasks)
    const projectsWithProgress = projects.map(p => {
      const totalTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE project_id = ?").get(p.id) as any
      const completedTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE project_id = ? AND is_completed = 1").get(p.id) as any

      return {
        ...p,
        totalTasks: totalTasks.count,
        completedTasks: completedTasks.count,
        progress: totalTasks.count > 0 ? Math.round((completedTasks.count / totalTasks.count) * 100) : 0
      }
    })

    // 4. Calculate Weekly Execution Score (for current week)
    // Note: This logic might need refinement based on exact "Week" definition
    const weeklyTasks = db.prepare(`
      SELECT COUNT(*) as total, SUM(is_completed) as completed 
      FROM tasks 
      JOIN projects ON tasks.project_id = projects.id
      WHERE projects.cycle_id = ? AND tasks.week_number = ?
    `).get(cycle.id, currentWeek) as any

    const weeklyScore = weeklyTasks.total > 0
      ? Math.round((weeklyTasks.completed / weeklyTasks.total) * 100)
      : 0

    return {
      cycle: { ...cycle, currentWeek },
      score: weeklyScore,
      projects: projectsWithProgress
    }
  })

  // Goals & Strategy API
  ipcMain.handle('get-projects', () => {
    const cycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any
    if (!cycle) return []
    return db.prepare("SELECT * FROM projects WHERE cycle_id = ? ORDER BY sort_order ASC, created_at ASC").all(cycle.id)
  })

  ipcMain.handle('create-project', (_, project) => {
    const cycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any
    if (!cycle) throw new Error('No active cycle')

    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO projects (id, cycle_id, title, description, color, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, cycle.id, project.title, project.description, project.color, project.icon)

    return { id, ...project }
  })

  ipcMain.handle('delete-project', (_, id) => {
    db.prepare("DELETE FROM projects WHERE id = ?").run(id)
    return true
  })

  ipcMain.handle('update-project', (_, project) => {
    db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, color = ?, icon = ?, start_date = ?, end_date = ?, priority = ?
      WHERE id = ?
    `).run(
      project.title,
      project.description,
      project.color,
      project.icon,
      project.start_date,
      project.end_date,
      project.priority,
      project.id
    )
    return project
  })

  ipcMain.handle('update-project-order', (_, projects) => {
    const update = db.prepare("UPDATE projects SET sort_order = ? WHERE id = ?")
    const transaction = db.transaction((projects) => {
      for (let i = 0; i < projects.length; i++) {
        update.run(i, projects[i].id)
      }
    })
    transaction(projects)
    return true
  })

  ipcMain.handle('get-project-tasks', (_, projectId) => {
    const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY week_number ASC").all(projectId)
    console.log('IPC: get-project-tasks returning:', tasks)
    return tasks
  })

  ipcMain.handle('create-task', (_, task) => {
    console.log('IPC: create-task received:', task)
    const id = crypto.randomUUID()
    db.prepare(`
      INSERT INTO tasks (id, project_id, week_number, title, description, is_completed, due_date, notes, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, task.project_id, task.week_number, task.title, task.description, 0, task.due_date, task.notes, task.priority)
    return { id, ...task, is_completed: 0 }
  })

  ipcMain.handle('delete-task', (_, id) => {
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id)
    return true
  })

  // Weekly Plan API
  ipcMain.handle('get-weekly-tasks', (_, weekNumber) => {
    const cycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any
    if (!cycle) return []

    // Get tasks with project info
    return db.prepare(`
      SELECT tasks.*, projects.title as project_title, projects.color as project_color 
      FROM tasks 
      JOIN projects ON tasks.project_id = projects.id 
      WHERE projects.cycle_id = ? AND tasks.week_number = ?
      ORDER BY projects.sort_order ASC, projects.created_at ASC, tasks.created_at
    `).all(cycle.id, weekNumber)
  })

  ipcMain.handle('toggle-task-complete', (_, { id, isCompleted }) => {
    db.prepare("UPDATE tasks SET is_completed = ? WHERE id = ?").run(isCompleted ? 1 : 0, id)
    return true
  })

  ipcMain.handle('update-task-notes', (_, { id, notes }) => {
    db.prepare("UPDATE tasks SET notes = ? WHERE id = ?").run(notes, id)
    return true
  })

  ipcMain.handle('update-task', (_, task) => {
    console.log('IPC: update-task received:', task)
    const fields = []
    const values = []

    if (task.title !== undefined) { fields.push('title = ?'); values.push(task.title) }
    if (task.description !== undefined) { fields.push('description = ?'); values.push(task.description) }
    if (task.due_date !== undefined) { fields.push('due_date = ?'); values.push(task.due_date) }
    if (task.priority !== undefined) { fields.push('priority = ?'); values.push(task.priority) }
    if (task.week_number !== undefined) { fields.push('week_number = ?'); values.push(task.week_number) }

    if (fields.length === 0) return true

    values.push(task.id)

    db.prepare(`
      UPDATE tasks 
      SET ${fields.join(', ')}
      WHERE id = ?
    `).run(...values)
    return true
  })

  ipcMain.handle('postpone-task', (_, id) => {
    const task = db.prepare("SELECT week_number FROM tasks WHERE id = ?").get(id) as any
    if (task && task.week_number < 12) {
      db.prepare("UPDATE tasks SET week_number = ? WHERE id = ?").run(task.week_number + 1, id)
      return true
    }
    return false
  })

  // Documents API
  ipcMain.handle('get-document', (_, { type, relatedId }) => {
    let query = "SELECT * FROM documents WHERE type = ?"
    const params = [type]

    if (relatedId) {
      query += " AND related_id = ?"
      params.push(relatedId)
    } else {
      query += " AND related_id IS NULL"
    }

    return db.prepare(query).get(...params)
  })

  ipcMain.handle('save-document', (_, { type, relatedId, content }) => {
    // Check if exists
    let checkQuery = "SELECT id FROM documents WHERE type = ?"
    const checkParams = [type]
    if (relatedId) {
      checkQuery += " AND related_id = ?"
      checkParams.push(relatedId)
    } else {
      checkQuery += " AND related_id IS NULL"
    }

    const existing = db.prepare(checkQuery).get(...checkParams) as any

    if (existing) {
      db.prepare("UPDATE documents SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(content, existing.id)
      return { id: existing.id, content }
    } else {
      const id = crypto.randomUUID()
      db.prepare("INSERT INTO documents (id, type, related_id, content) VALUES (?, ?, ?, ?)").run(id, type, relatedId || null, content)
      return { id, content }
    }
  })

  // Archive & Review API
  ipcMain.handle('get-archived-cycles', () => {
    return db.prepare("SELECT * FROM cycles WHERE status = 'archived' ORDER BY start_date DESC").all()
  })

  ipcMain.handle('archive-current-cycle', () => {
    const cycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any
    if (!cycle) return false

    // Calculate final score (average of weekly scores or total tasks)
    // For simplicity, let's just mark it archived.
    db.prepare("UPDATE cycles SET status = 'archived', end_date = CURRENT_TIMESTAMP WHERE id = ?").run(cycle.id)
    return true
  })

  ipcMain.handle('get-weekly-review', (_, { weekNumber, cycleId }) => {
    console.log('IPC: get-weekly-review called with:', { weekNumber, cycleId })
    try {
      if (weekNumber === undefined) throw new Error('weekNumber is required')

      let targetCycleId = cycleId
      if (!targetCycleId) {
        const cycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any
        if (!cycle) {
          console.log('IPC: get-weekly-review - No active cycle found')
          return null
        }
        targetCycleId = cycle.id
      }
      console.log('IPC: get-weekly-review - targetCycleId:', targetCycleId)
      return db.prepare("SELECT * FROM reviews WHERE cycle_id = ? AND week_number = ?").get(targetCycleId, weekNumber)
    } catch (error) {
      console.error('IPC: get-weekly-review failed:', error)
      throw error
    }
  })

  ipcMain.handle('save-weekly-review', (_, { weekNumber, content, rating }) => {
    console.log('IPC: save-weekly-review called with:', { weekNumber, rating, contentLength: content?.length })
    try {
      if (weekNumber === undefined) throw new Error('weekNumber is required')

      const cycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any
      if (!cycle) throw new Error('No active cycle')

      const existing = db.prepare("SELECT id FROM reviews WHERE cycle_id = ? AND week_number = ?").get(cycle.id, weekNumber) as any

      if (existing) {
        console.log('IPC: save-weekly-review - Updating existing review:', existing.id)
        db.prepare("UPDATE reviews SET content = ?, rating = ? WHERE id = ?").run(content, rating, existing.id)
      } else {
        const id = crypto.randomUUID()
        console.log('IPC: save-weekly-review - Creating new review:', id)
        db.prepare("INSERT INTO reviews (id, cycle_id, week_number, content, rating) VALUES (?, ?, ?, ?, ?)").run(id, cycle.id, weekNumber, content, rating)
      }
      return true
    } catch (error) {
      console.error('IPC: save-weekly-review failed:', error)
      throw error
    }
  })

  ipcMain.handle('update-cycle', (_, { id, title, startDate }) => {
    console.log('IPC: update-cycle received:', { id, title, startDate })
    const start = new Date(startDate)
    const end = new Date(start.getTime() + 84 * 24 * 60 * 60 * 1000) // 12 weeks * 7 days

    try {
      db.prepare(`
        UPDATE cycles 
        SET title = ?, start_date = ?, end_date = ?
        WHERE id = ?
      `).run(title, startDate, end.toISOString(), id)
      console.log('IPC: update-cycle success')
      return true
    } catch (error) {
      console.error('IPC: update-cycle failed:', error)
      throw error
    }
  })

  ipcMain.handle('start-new-cycle', (_, { title, startDate }) => {
    const currentCycle = db.prepare("SELECT id FROM cycles WHERE status = 'active'").get() as any

    // Transaction to ensure atomicity
    const transaction = db.transaction(() => {
      // Archive current cycle if exists
      if (currentCycle) {
        db.prepare("UPDATE cycles SET status = 'archived', end_date = CURRENT_TIMESTAMP WHERE id = ?").run(currentCycle.id)
      }

      // Create new cycle
      const id = crypto.randomUUID()
      const start = new Date(startDate)
      const end = new Date(start.getTime() + 84 * 24 * 60 * 60 * 1000) // 12 weeks

      db.prepare(`
        INSERT INTO cycles (id, title, start_date, end_date, status)
        VALUES (?, ?, ?, ?, 'active')
      `).run(id, title, startDate, end.toISOString())
    })

    transaction()
    return true
  })
}
