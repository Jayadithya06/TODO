import { useState, useEffect } from 'react'
import Login from './login'
import Register from './Register'
import Todo from './Todo'

function App() {
  const [page, setPage] = useState('login')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      window.history.replaceState({}, '', '/')
      window.location.reload()
    }
  }, [])

  const token = localStorage.getItem('token')

  if (token) {
    return <Todo />
  }

  return (
    <div className="auth-container">
      {page === 'login'
        ? <Login onSwitch={() => setPage('register')} />
        : <Register onSwitch={() => setPage('login')} />
      }
    </div>
  )
}

export default App