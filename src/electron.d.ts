export interface IElectronAPI {
  getDashboardData: () => Promise<{
    cycle: any
    score: number
    projects: any[]
  }>
  getProjects: () => Promise<any[]>
  createProject: (project: any) => Promise<any>
  updateProject: (project: any) => Promise<any>
  deleteProject: (id: string) => Promise<boolean>
  updateProjectOrder: (projects: any[]) => Promise<boolean>
  getProjectTasks: (projectId: string) => Promise<any[]>
  createTask: (task: any) => Promise<any>
  deleteTask: (id: string) => Promise<boolean>
  getWeeklyTasks: (week: number) => Promise<any[]>
  toggleTaskComplete: (id: string, isCompleted: boolean) => Promise<boolean>
  updateTaskNotes: (data: { id: string; notes: string }) => Promise<boolean>
  updateTask: (task: { id: string; title?: string; description?: string; due_date?: Date | string | null; priority?: string; week_number?: number }) => Promise<boolean>
  postponeTask: (id: string) => Promise<boolean>
  getDocument: (type: string, relatedId?: string) => Promise<{ id: string, content: string } | undefined>
  saveDocument: (type: string, content: string, relatedId?: string) => Promise<{ id: string, content: string }>
  getArchivedCycles: () => Promise<any[]>
  archiveCurrentCycle: () => Promise<boolean>
  getWeeklyReview: (weekNumber: number, cycleId?: string) => Promise<any>
  saveWeeklyReview: (weekNumber: number, content: string, rating: number) => Promise<boolean>
  setMenuBarVisibility: (visible: boolean) => Promise<void>
  updateCycle: (data: { id: string; title: string; startDate: string }) => Promise<boolean>
  startNewCycle: (data: { title: string; startDate: string }) => Promise<boolean>
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI
  }
}
