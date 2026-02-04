import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/styles/TicketDetail.css'

function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAuthHeader, user } = useAuth()
  
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: ''
  })

  const isAdmin = user?.role === 'ADMIN'
  const isCreator = ticket?.created_by === user?.userId
  const canEditTicket = isAdmin || isCreator
  const canEditStatus = isAdmin

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch ticket')
      }
      
      setTicket(data.ticket)
      setFormData({
        title: data.ticket.title,
        description: data.ticket.description,
        priority: data.ticket.priority,
        status: data.ticket.status
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update ticket')
      }
      
      setTicket(data.ticket)
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to delete ticket')
      }
      
      navigate('/tickets', { state: { message: 'Ticket deleted successfully' } })
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/tickets/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update status')
      }
      
      setTicket(prev => ({ ...prev, status: newStatus }))
      setFormData(prev => ({ ...prev, status: newStatus }))
    } catch (err) {
      setError(err.message)
    }
  }

  const cancelEdit = () => {
    setFormData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status
    })
    setIsEditing(false)
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      'OPEN': 'badge-open',
      'IN_PROGRESS': 'badge-progress',
      'RESOLVED': 'badge-resolved',
      'CLOSED': 'badge-closed'
    }
    return `status-badge ${classes[status] || ''}`
  }

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      'LOW': 'priority-low',
      'MEDIUM': 'priority-medium',
      'HIGH': 'priority-high',
      'URGENT': 'priority-urgent'
    }
    return `priority-badge ${classes[priority] || ''}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="ticket-detail-container">
        <div className="loading">Loading ticket...</div>
      </div>
    )
  }

  if (error && !ticket) {
    return (
      <div className="ticket-detail-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/tickets" className="btn-back">Back to Tickets</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-header">
        <Link to="/tickets" className="btn-back">← Back to Tickets</Link>
        {canEditTicket && !isEditing && (
          <div className="header-actions">
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Edit Ticket
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn-confirm-delete">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ticket-detail-card">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {isAdmin && <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>}
            </div>

            <div className="form-actions">
              <button type="button" onClick={cancelEdit} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-save">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="ticket-header-info">
              <span className="ticket-number">{ticket.ticket_number}</span>
              <div className="ticket-badges">
                <span className={getStatusBadgeClass(ticket.status)}>
                  {ticket.status?.replace('_', ' ')}
                </span>
                <span className={getPriorityBadgeClass(ticket.priority)}>
                  {ticket.priority}
                </span>
              </div>
            </div>

            <h1 className="ticket-title">{ticket.title}</h1>

            <div className="ticket-meta">
              <div className="meta-item">
                <span className="meta-label">Created by:</span>
                <span className="meta-value">{ticket.creator?.name || 'Unknown'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Updated:</span>
                <span className="meta-value">{formatDate(ticket.updatedAt)}</span>
              </div>
              {ticket.resolved_at && (
                <div className="meta-item">
                  <span className="meta-label">Resolved:</span>
                  <span className="meta-value">{formatDate(ticket.resolved_at)}</span>
                </div>
              )}
              {ticket.closed_at && (
                <div className="meta-item">
                  <span className="meta-label">Closed:</span>
                  <span className="meta-value">{formatDate(ticket.closed_at)}</span>
                </div>
              )}
            </div>

            <div className="ticket-description">
              <h3>Description</h3>
              <p>{ticket.description}</p>
            </div>

            {isAdmin && ticket.status !== 'CLOSED' && (
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="status-buttons">
                  {ticket.status !== 'OPEN' && (
                    <button onClick={() => handleStatusChange('OPEN')} className="btn-status">
                      Reopen
                    </button>
                  )}
                  {ticket.status !== 'IN_PROGRESS' && (
                    <button onClick={() => handleStatusChange('IN_PROGRESS')} className="btn-status">
                      Mark In Progress
                    </button>
                  )}
                  {ticket.status !== 'RESOLVED' && (
                    <button onClick={() => handleStatusChange('RESOLVED')} className="btn-status btn-resolve">
                      Mark Resolved
                    </button>
                  )}
                  {ticket.status !== 'CLOSED' && (
                    <button onClick={() => handleStatusChange('CLOSED')} className="btn-status btn-close">
                      Close Ticket
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TicketDetail
