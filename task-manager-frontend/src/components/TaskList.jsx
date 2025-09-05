import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllTasks, deleteTask, updateStatus, searchTasks } from '../services/taskService'
import StatusBadge from './StatusBadge'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      let res
      if (q && q.trim().length > 0) {
        res = await searchTasks(q.trim())
      } else {
        res = await getAllTasks()
      }
      setTasks(res.data)
    } catch (e) {
      console.error(e)
      setError(e?.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    await deleteTask(id)
    load()
  }

  const handleStatus = async (id, status) => {
    await updateStatus(id, status)
    load()
  }

  const formatDate = (d) => {
    if (!d) return ''
    // Expecting yyyy-MM-dd from backend
    return new Date(d).toISOString().substring(0,10)
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <input
          className="form-control me-2"
          placeholder="Search by title..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          style={{ maxWidth: 360 }}
        />
        <button className="btn btn-outline-secondary me-2" onClick={load}>Search</button>
        <button className="btn btn-outline-dark" onClick={() => { setQ(''); load() }}>Reset</button>
      </div>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && tasks.length === 0 && <div className="alert alert-warning">No tasks found.</div>}

      {tasks.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Due Date</th>
                <th style={{width: 280}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td style={{maxWidth: 380}}>{t.description}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.dueDate}</td>
                  <td>
                    <Link to={`/edit/${t.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                    <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-danger me-2">Delete</button>
                    {t.status !== 'PENDING' && (
                      <button className="btn btn-sm btn-secondary me-2" onClick={() => handleStatus(t.id, 'PENDING')}>Mark Pending</button>
                    )}
                    {t.status !== 'IN_PROGRESS' && (
                      <button className="btn btn-sm btn-info me-2" onClick={() => handleStatus(t.id, 'IN_PROGRESS')}>Start</button>
                    )}
                    {t.status !== 'COMPLETED' && (
                      <button className="btn btn-sm btn-success" onClick={() => handleStatus(t.id, 'COMPLETED')}>Complete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
