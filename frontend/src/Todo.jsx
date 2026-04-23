import { useState, useEffect } from 'react'
import API from './api'
import MFA from './MFA'
import Payment from './Payment'

export default function Todo() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [showMFA, setShowMFA] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchTasks()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/me')
      setUser(res.data)
    } catch (err) {
      console.log('Could not fetch user')
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      setError('Failed to load tasks')
    }
  }

  const addTask = async () => {
    if (!title.trim()) return
    try {
      await API.post('/tasks', { title })
      setTitle('')
      fetchTasks()
    } catch (err) {
      setError('Failed to add task')
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      await API.put(`/tasks/${id}`, { completed: !completed })
      fetchTasks()
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    })
  }

  const firstName = user?.name?.split(' ')[0] || 'there'
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.filter(t => !t.completed)
  const done = tasks.filter(t => t.completed)

  return (
    <div>
      <div className="topbar">
        <span className="logo">TO-DO</span>
        <div className="topbar-right">
          <span className="topbar-name">{user?.name || ''}</span>
          <div className="avatar">
            {user?.photo
            ? <img src={user.photo} alt="profile" referrerPolicy="no-referrer" />
            : initials}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="greeting-row">
          <div className="avatar">
            {user?.photo
            ? <img src={user.photo} alt="profile" referrerPolicy="no-referrer" />
            : initials}
          </div>
          <div className="greeting-text">
            <h1>{getGreeting()}, {firstName}</h1>
            <p>{getDate()} · Here's your day at a glance</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-label">Total tasks</div>
            <div className="stat-value">{tasks.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Completed</div>
            <div className="stat-value green">{completed}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Remaining</div>
            <div className="stat-value amber">{pending.length}</div>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="input-section">
          <div className="input-row">
            <input
              type="text"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="add-btn" onClick={addTask}>Add</button>
          </div>
        </div>

        {pending.length > 0 && (
          <>
            <div className="section-label">Pending</div>
            <div className="tasks">
              {pending.map(task => (
                <div key={task._id} className="task-item">
                  <div
                    className="check-circle"
                    onClick={() => toggleTask(task._id, task.completed)}
                  />
                  <span className="task-title">{task.title}</span>
                  <button className="del-btn" onClick={() => deleteTask(task._id)}>×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {done.length > 0 && (
          <>
            <div className="section-label">Completed</div>
            <div className="tasks">
              {done.map(task => (
                <div key={task._id} className="task-item done">
                  <div
                    className="check-circle checked"
                    onClick={() => toggleTask(task._id, task.completed)}
                  />
                  <span className="task-title">{task.title}</span>
                  <button className="del-btn" onClick={() => deleteTask(task._id)}>×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tasks.length === 0 && (
          <div className="empty-state">No tasks yet — add one above!</div>
        )}

        {showMFA && <MFA onClose={() => setShowMFA(false)} />}
        {showPayment && <Payment />}

        <div className="action-row">
          <button
            className="action-btn"
            onClick={() => { setShowMFA(!showMFA); setShowPayment(false) }}
          >
            {showMFA ? 'Hide MFA' : 'Setup MFA'}
          </button>
          <button
            className="action-btn"
            onClick={() => { setShowPayment(!showPayment); setShowMFA(false) }}
          >
            {showPayment ? 'Hide Payment' : 'Upgrade to Pro'}
          </button>
          <button className="action-btn danger" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  )
}