# React Gantt with Mantine UI

A customizable, high-performance React Gantt chart component built with [Mantine UI](https://mantine.dev/).

## Features

- Built with Mantine UI components for consistent styling
- TypeScript support
- React 18 & 19 compatible
- Customizable and extensible
- Modern build system with Rollup

## Installation

```bash
npm install @wojakgra/react-gantt-mantine @mantine/core @mantine/hooks
```

## Usage

```tsx
import { Gantt } from '@wojakgra/react-gantt-mantine';
import '@wojakgra/react-gantt-mantine/styles.css';
import '@mantine/core/styles.css';

const tasks = [
  {
    id: 1,
    text: 'Task 1',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 15),
    type: 'task',
  },
  {
    id: 2,
    text: 'Task 2',
    start: new Date(2024, 0, 10),
    end: new Date(2024, 0, 25),
    type: 'task',
  },
];

function App() {
  return (
    <Gantt
      tasks={tasks}
      onTaskUpdate={(task) => console.log('Task updated:', task)}
    />
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run in development mode
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint
```

## Project Structure

This project follows the [Mantine extension template](https://github.com/mantinedev/extension-template) structure:

- `package/src/` - Source code
- `package/dist/` - Build output
- `demos/` - Demo applications

## License

MIT
