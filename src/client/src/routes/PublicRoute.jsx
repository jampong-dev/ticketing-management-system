function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-container">Loading...</div>
  }
  
  if (isAuthenticated) {
    return <Navigate to="/tickets" replace />
  }
  
  return children
}

export default PublicRoute