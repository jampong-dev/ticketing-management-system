import React from 'react'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const path = window.location.pathname
  
  return (
    <div>
      {path === '/register' ? <Register /> : <Login />}
    </div>
  )
}

export default App
