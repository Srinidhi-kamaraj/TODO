import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks', { headers });
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await axios.post('http://localhost:5000/tasks', { title }, { headers });
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error('Add error:', err.message);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed }, { headers });
      fetchTasks();
    } catch (err) {
      console.error('Toggle error:', err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, { headers });
      fetchTasks();
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const updateTask = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { title: editTitle }, { headers });
      setEditingId(null);
      setEditTitle('');
      fetchTasks();
    } catch (err) {
      console.error('Update error:', err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h2>My Tasks</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask} style={{ marginLeft: '10px'}}>Add</button>
      <button onClick={logout} style={{ marginLeft: '10px', backgroundColor: 'gray' }}>Logout</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {editingId === task._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <button onClick={() => updateTask(task._id)} style={{ marginLeft: '10px'}}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: '10px'}}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleComplete(task._id, task.completed)}
                >
                  {task.title}
                </span>
                <button onClick={() => startEditing(task)}  style={{ marginLeft: '10px'}}>✏️</button>
                <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '10px'}}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
