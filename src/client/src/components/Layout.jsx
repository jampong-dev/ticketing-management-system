import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/styles/Layout.css'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isOnTicketsPage = location.pathname === '/tickets'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/tickets" className="logo">
            Ticketing System
          </Link>
          
          {isOnTicketsPage && <nav className="nav-menu">
            <Link to="/tickets" className="nav-link">Tickets</Link>
            <Link to="/tickets/create" className="nav-link">Create Ticket</Link>
          </nav>}

          <div className="user-menu">
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Ticketing Management System</p>
      </footer>
    </div>
  )
}

export default Layout
