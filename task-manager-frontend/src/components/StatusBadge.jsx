import React from 'react'

export default function StatusBadge({ status }) {
  const map = {
    'PENDING': 'secondary',
    'IN_PROGRESS': 'warning',
    'COMPLETED': 'success'
  }
  const cls = map[status] || 'secondary'
  return <span className={`badge badge-status bg-${cls}`}>{status}</span>
}
