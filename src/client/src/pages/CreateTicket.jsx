import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/styles/CreateTicket.css'

function CreateTicket() {
  const navigate = useNavigate()
  const { getAuthHeader, user } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { title, description, priority } = formData

    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          created_by: user.userId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create ticket')
      }

      navigate('/tickets', { 
        state: { message: 'Ticket created successfully!' }
      })

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-card">
        <div className="card-header">
          <h1>Create New Ticket</h1>
          <Link to="/tickets" className="back-link">← Back to Tickets</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              maxLength={200}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about your issue..."
              rows={6}
              required
            />
          </div>

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

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/tickets')} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTicket
