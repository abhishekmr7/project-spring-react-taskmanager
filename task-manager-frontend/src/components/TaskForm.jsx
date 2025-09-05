import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createTask, getTaskById, updateTask } from '../services/taskService'

export default function TaskForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState({ title: '', description: '', status: 'PENDING', dueDate: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      getTaskById(id).then(res => {
        const t = res.data
        // Ensure date input format
        setTask({ ...t, dueDate: (t.dueDate || '').substring(0,10) })
      })
    }
  }, [id])

  const onChange = (e) => {
    const { name, value } = e.target
    setTask(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (id) {
        await updateTask(id, task)
      } else {
        await createTask(task)
      }
      navigate('/')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="mb-3">{id ? 'Edit Task' : 'Add Task'}</h4>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input className="form-control" name="title" value={task.title} onChange={onChange} required maxLength={200} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" name="description" value={task.description} onChange={onChange} maxLength={2000} />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={task.status} onChange={onChange}>
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" name="dueDate" value={task.dueDate} onChange={onChange} required />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : (id ? 'Update' : 'Create')}</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
