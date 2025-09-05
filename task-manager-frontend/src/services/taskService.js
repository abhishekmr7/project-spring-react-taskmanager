import api from './api'

const TASKS = '/tasks'

export const getAllTasks = () => api.get(TASKS)
export const getTaskById = (id) => api.get(`${TASKS}/${id}`)
export const createTask = (task) => api.post(TASKS, task)
export const updateTask = (id, task) => api.put(`${TASKS}/${id}`, task)
export const deleteTask = (id) => api.delete(`${TASKS}/${id}`)
export const updateStatus = (id, status) => api.patch(`${TASKS}/${id}/status`, null, { params: { value: status } })
export const searchTasks = (title) => api.get(`${TASKS}/search`, { params: { title } })
export const getByStatusPaged = (status, page=0, size=10, sort='dueDate,asc') =>
  api.get(`${TASKS}/status/${status}`, { params: { page, size, sort } })
