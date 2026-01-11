import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Gantt } from '../package/src/index';

// Sample data
const tasks = [
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

const links = [
  { id: 1, source: 2, target: 3, type: '0' },
  { id: 2, source: 3, target: 4, type: '0' },
  { id: 3, source: 5, target: 6, type: '0' },
  { id: 4, source: 4, target: 7, type: '0' },
  { id: 5, source: 7, target: 8, type: '0' },
];

function App() {
  const handleTaskUpdate = (task) => {
    console.log('Task updated:', task);
  };

  const handleTaskCreate = (task) => {
    console.log('Task created:', task);
  };

  const handleTaskDelete = (id) => {
    console.log('Task deleted:', id);
  };

  return (
    <MantineProvider>
      <div style={{ height: '100vh', padding: '20px' }}>
        <h1>React Gantt Chart with Mantine UI</h1>
        <div style={{ height: 'calc(100vh - 100px)' }}>
          <Gantt
            tasks={tasks}
            links={links}
            rowHeight={40}
            cellWidth={100}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
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
