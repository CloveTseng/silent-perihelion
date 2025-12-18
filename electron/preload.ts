import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // App API
  getDashboardData: () => ipcRenderer.invoke('get-dashboard-data'),

  // Goals API
  getProjects: () => ipcRenderer.invoke('get-projects'),
  createProject: (project: any) => ipcRenderer.invoke('create-project', project),
  updateProject: (project: any) => ipcRenderer.invoke('update-project', project),
  deleteProject: (id: string) => ipcRenderer.invoke('delete-project', id),
  updateProjectOrder: (projects: any[]) => ipcRenderer.invoke('update-project-order', projects),
  getProjectTasks: (projectId: string) => ipcRenderer.invoke('get-project-tasks', projectId),
  createTask: (task: any) => ipcRenderer.invoke('create-task', task),
  updateTask: (task: any) => ipcRenderer.invoke('update-task', task),
  deleteTask: (id: string) => ipcRenderer.invoke('delete-task', id),

  // Weekly API
  getWeeklyTasks: (week: number) => ipcRenderer.invoke('get-weekly-tasks', week),
  toggleTaskComplete: (id: string, isCompleted: boolean) => ipcRenderer.invoke('toggle-task-complete', { id, isCompleted }),
  updateTaskNotes: (id: string, notes: string) => ipcRenderer.invoke('update-task-notes', { id, notes }),
  postponeTask: (id: string) => ipcRenderer.invoke('postpone-task', id),

  // Documents API
  getDocument: (type: string, relatedId?: string) => ipcRenderer.invoke('get-document', { type, relatedId }),
  saveDocument: (type: string, content: string, relatedId?: string) => ipcRenderer.invoke('save-document', { type, content, relatedId }),

  // Archive & Review API
  getArchivedCycles: () => ipcRenderer.invoke('get-archived-cycles'),
  archiveCurrentCycle: () => ipcRenderer.invoke('archive-current-cycle'),
  getWeeklyReview: (weekNumber: number, cycleId?: string) => ipcRenderer.invoke('get-weekly-review', { weekNumber, cycleId }),
  saveWeeklyReview: (weekNumber: number, content: string, rating: number) => ipcRenderer.invoke('save-weekly-review', { weekNumber, content, rating }),

  // Settings
  setMenuBarVisibility: (visible: boolean) => ipcRenderer.invoke('set-menu-bar-visibility', visible),
  updateCycle: (data: any) => ipcRenderer.invoke('update-cycle', data),
  startNewCycle: (data: any) => ipcRenderer.invoke('start-new-cycle', data),
})
