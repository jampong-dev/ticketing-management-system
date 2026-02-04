import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/styles/TicketList.css'

function TicketList() {
  const { getAuthHeader, user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  })

  const isAdmin = user?.role === 'ADMIN'

  const fetchTickets = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      })

      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.search) params.append('search', filters.search)

      // Use different endpoint based on role
      const endpoint = isAdmin ? '/api/tickets' : '/api/tickets/my-tickets'
      
      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch tickets')
      }

      setTickets(data.tickets || [])
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [pagination.page, filters.status, filters.priority])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchTickets()
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      'OPEN': 'badge-open',
      'IN_PROGRESS': 'badge-progress',
      'RESOLVED': 'badge-resolved',
      'CLOSED': 'badge-closed'
    }
    return `badge ${classes[status] || ''}`
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h1>{isAdmin ? 'All Tickets' : 'My Tickets'}</h1>
        <Link to="/tickets/create" className="btn-create">
          + Create Ticket
        </Link>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Search tickets..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-dropdowns">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="no-tickets">
          <p>No tickets found</p>
          <Link to="/tickets/create">Create your first ticket</Link>
        </div>
      ) : (
        <>
          <div className="tickets-table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  {isAdmin && <th>Created By</th>}
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td className="ticket-number">{ticket.ticket_number}</td>
                    <td className="ticket-title">{ticket.title}</td>
                    <td>
                      <span className={getStatusBadgeClass(ticket.status)}>
                        {ticket.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={getPriorityBadgeClass(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>{ticket.creator?.name || '-'}</td>
                    )}
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td>
                      <Link to={`/tickets/${ticket.id}`} className="btn-view">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TicketList
