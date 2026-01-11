import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import { Gantt } from '../package/src/index';

// Sample initial data
const initialTasks = [
  {
    id: 1,
    text: 'Project Planning',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 15),
    progress: 100,
    type: 'summary',
  },
  {
    id: 2,
    text: 'Research Phase',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 8),
    progress: 100,
    type: 'task',
    parent: 1,
  },
  {
    id: 3,
    text: 'Requirements Gathering',
    start: new Date(2024, 0, 8),
    end: new Date(2024, 0, 15),
    progress: 85,
    type: 'task',
    parent: 1,
  },
  {
    id: 4,
    text: 'Development',
    start: new Date(2024, 0, 15),
    end: new Date(2024, 1, 28),
    progress: 45,
    type: 'summary',
  },
  {
    id: 5,
    text: 'Frontend Development',
    start: new Date(2024, 0, 15),
    end: new Date(2024, 1, 15),
    progress: 60,
    type: 'task',
    parent: 4,
  },
  {
    id: 6,
    text: 'Backend Development',
    start: new Date(2024, 0, 22),
    end: new Date(2024, 1, 28),
    progress: 30,
    type: 'task',
    parent: 4,
  },
  {
    id: 7,
    text: 'Testing & QA',
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 15),
    progress: 0,
    type: 'task',
  },
  {
    id: 8,
    text: 'Deployment',
    start: new Date(2024, 2, 15),
    end: new Date(2024, 2, 15),
    progress: 0,
    type: 'milestone',
  },
];

const initialLinks = [
  { id: 1, source: 2, target: 3, type: '0' },
  { id: 2, source: 3, target: 4, type: '0' },
  { id: 3, source: 5, target: 6, type: '0' },
  { id: 4, source: 4, target: 7, type: '0' },
  { id: 5, source: 7, target: 8, type: '0' },
];

// Simulated API functions
const api = {
  // Simulate saving a task to backend
  saveTask: async (task) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In real app, this would be:
    // const response = await fetch('/api/tasks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(task),
    // });
    // return response.json();
    
    console.log('API: Saving task to backend:', task);
    return { ...task, id: Math.floor(Math.random() * 10000) }; // Return with server-generated ID
  },

  // Simulate updating a task
  updateTask: async (task) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In real app:
    // const response = await fetch(`/api/tasks/${task.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(task),
    // });
    // return response.json();
    
    console.log('API: Updating task on backend:', task);
    return task;
  },

  // Simulate deleting a task
  deleteTask: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In real app:
    // await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    
    console.log('API: Deleting task from backend:', id);
  },
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [links] = useState(initialLinks);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: '', type: 'success' }),
      3000
    );
  };

  const handleTaskCreate = async (newTask) => {
    try {
      // Optimistically add to UI
      setTasks((prev) => [...prev, newTask]);

      // Save to backend
      const savedTask = await api.saveTask(newTask);

      // Update with server-generated ID
      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? savedTask : t))
      );

      showNotification(
        `Task "${savedTask.text}" created successfully!`,
        'success'
      );
      console.log('Task created and saved to backend:', savedTask);
    } catch (error) {
      // Rollback on error
      setTasks((prev) => prev.filter((t) => t.id !== newTask.id));
      showNotification('Failed to create task. Please try again.', 'error');
      console.error('Error creating task:', error);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      // Optimistically update UI
      const originalTasks = tasks;
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );

      // Update on backend
      await api.updateTask(updatedTask);

      showNotification(
        `Task "${updatedTask.text}" updated successfully!`,
        'success'
      );
      console.log('Task updated on backend:', updatedTask);
    } catch (error) {
      // Rollback on error
      setTasks(originalTasks);
      showNotification('Failed to update task. Please try again.', 'error');
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      const taskToDelete = tasks.find((t) => t.id === id);

      // Optimistically remove from UI
      setTasks((prev) => prev.filter((t) => t.id !== id));

      // Delete from backend
      await api.deleteTask(id);

      showNotification(
        `Task "${taskToDelete?.text}" deleted successfully!`,
        'success'
      );
      console.log('Task deleted from backend:', id);
    } catch (error) {
      // Rollback on error
      showNotification('Failed to delete task. Please try again.', 'error');
      console.error('Error deleting task:', error);
    }
  };

  return (
    <MantineProvider>
      <div style={{ height: '100vh', padding: '20px' }}>
        <h1>React Gantt Chart with Mantine UI</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          <strong>Backend Integration Demo:</strong> All task operations
          (create, update, delete) are logged to console and simulate API calls
          with 500ms delay.
        </p>

        {notification.show && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 10000,
            }}
          >
            <Notification
              icon={
                notification.type === 'success' ? (
                  <IconCheck size={18} />
                ) : (
                  <IconX size={18} />
                )
              }
              color={notification.type === 'success' ? 'teal' : 'red'}
              title={notification.type === 'success' ? 'Success' : 'Error'}
              onClose={() => setNotification({ ...notification, show: false })}
            >
              {notification.message}
            </Notification>
          </div>
        )}

        <div style={{ height: 'calc(100vh - 140px)' }}>
          <Gantt
            tasks={tasks}
            links={links}
            rowHeight={40}
            cellWidth={100}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </div>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
