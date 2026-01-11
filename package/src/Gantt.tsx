import React, { useMemo, useState } from 'react';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
  useStyles,
  Table,
  ScrollArea,
  ActionIcon,
  Group,
  Button,
} from '@mantine/core';
import { IconPlus, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { TaskForm } from './TaskForm';
import classes from './Gantt.module.css';

export type GanttStylesNames =
  | 'root'
  | 'container'
  | 'leftPanel'
  | 'rightPanel'
  | 'toolbar'
  | 'grid'
  | 'chart'
  | 'chartHeader'
  | 'chartBody'
  | 'timeScale'
  | 'taskRow'
  | 'taskBar'
  | 'link';

export type GanttCssVariables = {
  root: '--gantt-row-height' | '--gantt-cell-width';
};

export interface Task {
  id: number | string;
  text: string;
  start: Date;
  end: Date;
  duration?: number;
  progress?: number;
  type?: 'task' | 'summary' | 'milestone';
  parent?: number | string;
}

export interface Link {
  id: number | string;
  source: number | string;
  target: number | string;
  type?: string;
}

export interface GanttProps
  extends BoxProps,
    StylesApiProps<GanttFactory>,
    ElementProps<'div'> {
  /** Array of tasks to display in the Gantt chart */
  tasks?: Task[];

  /** Array of links between tasks */
  links?: Link[];

  /** Row height in pixels, default is 40 */
  rowHeight?: number;

  /** Cell width in pixels, default is 100 */
  cellWidth?: number;

  /** Whether the Gantt chart is readonly */
  readonly?: boolean;

  /** Callback when a task is updated */
  onTaskUpdate?: (task: Task) => void;

  /** Callback when a task is created */
  onTaskCreate?: (task: Task) => void;

  /** Callback when a task is deleted */
  onTaskDelete?: (id: number | string) => void;

  /** Callback when a link is created */
  onLinkCreate?: (link: Link) => void;

  /** Callback when a link is deleted */
  onLinkDelete?: (id: number | string) => void;
}

export type GanttFactory = Factory<{
  props: GanttProps;
  ref: HTMLDivElement;
  stylesNames: GanttStylesNames;
  vars: GanttCssVariables;
}>;

const defaultProps: Partial<GanttProps> = {
  tasks: [],
  links: [],
  rowHeight: 40,
  cellWidth: 100,
  readonly: false,
};

const varsResolver = createVarsResolver<GanttFactory>(
  (theme, { rowHeight, cellWidth }) => ({
    root: {
      '--gantt-row-height': `${rowHeight}px`,
      '--gantt-cell-width': `${cellWidth}px`,
    },
  }),
);

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to calculate task position
const calculateTaskPosition = (
  task: Task,
  startDate: Date,
  cellWidth: number,
): { left: number; width: number } => {
  const dayInMs = 24 * 60 * 60 * 1000;
  const daysFromStart = Math.floor(
    (task.start.getTime() - startDate.getTime()) / dayInMs,
  );
  const taskDuration = Math.max(
    1,
    Math.ceil((task.end.getTime() - task.start.getTime()) / dayInMs),
  );

  return {
    left: daysFromStart * cellWidth,
    width: taskDuration * cellWidth,
  };
};

// Generate time scale
const generateTimeScale = (start: Date, end: Date): Date[] => {
  const scale: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);

  while (current <= end) {
    scale.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return scale;
};

export const Gantt = factory<GanttFactory>((_props, ref) => {
  const props = useProps('Gantt', defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    tasks = [],
    links = [],
    rowHeight = 40,
    cellWidth = 100,
    readonly,
    onTaskUpdate,
    onTaskCreate,
    ...others
  } = props;

  const [zoom, setZoom] = useState(1);
  const [taskFormOpened, setTaskFormOpened] = useState(false);

  const getStyles = useStyles<GanttFactory>({
    name: 'Gantt',
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // Generate a temporary ID
    };
    onTaskCreate?.(newTask);
  };

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      const now = new Date();
      return {
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      };
    }

    const dates = tasks.flatMap((t) => [t.start, t.end]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Add padding
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1);

    return { startDate: minDate, endDate: maxDate };
  }, [tasks]);

  const timeScale = useMemo(
    () => generateTimeScale(startDate, endDate),
    [startDate, endDate],
  );

  const effectiveCellWidth = cellWidth * zoom;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <Box ref={ref} {...getStyles('root')} {...others}>
      {/* Task Form Modal */}
      <TaskForm
        opened={taskFormOpened}
        onClose={() => setTaskFormOpened(false)}
        onSubmit={handleCreateTask}
        existingTasks={tasks}
      />

      {/* Toolbar */}
      <div {...getStyles('toolbar')}>
        <Group justify="space-between">
          <Group>
            <Button
              size="sm"
              leftSection={<IconPlus size={16} />}
              onClick={() => setTaskFormOpened(true)}
              disabled={readonly}
            >
              Add Task
            </Button>
          </Group>
          <Group>
            <ActionIcon onClick={handleZoomOut} variant="light">
              <IconZoomOut size={16} />
            </ActionIcon>
            <span style={{ fontSize: '14px', minWidth: '60px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <ActionIcon onClick={handleZoomIn} variant="light">
              <IconZoomIn size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </div>

      {/* Main content */}
      <div {...getStyles('container')}>
        {/* Left panel - Task grid */}
        <div {...getStyles('leftPanel')}>
          <ScrollArea style={{ height: '100%' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Task Name</Table.Th>
                  <Table.Th>Start Date</Table.Th>
                  <Table.Th>End Date</Table.Th>
                  <Table.Th>Progress</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tasks.map((task) => (
                  <Table.Tr key={task.id} style={{ height: `${rowHeight}px` }}>
                    <Table.Td>
                      {task.parent && '  ↳ '}
                      {task.text}
                    </Table.Td>
                    <Table.Td>{formatDate(task.start)}</Table.Td>
                    <Table.Td>{formatDate(task.end)}</Table.Td>
                    <Table.Td>{task.progress || 0}%</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>

        {/* Right panel - Chart */}
        <div {...getStyles('rightPanel')}>
          <ScrollArea style={{ height: '100%' }}>
            <div {...getStyles('chart')}>
              {/* Time scale header */}
              <div
                {...getStyles('chartHeader')}
                style={{ width: timeScale.length * effectiveCellWidth }}
              >
                {timeScale.map((date, idx) => (
                  <div
                    key={idx}
                    {...getStyles('timeScale')}
                    style={{
                      width: effectiveCellWidth,
                      left: idx * effectiveCellWidth,
                    }}
                  >
                    {date.getDate()}
                  </div>
                ))}
              </div>

              {/* Task bars */}
              <div {...getStyles('chartBody')}>
                {tasks.map((task, idx) => {
                  const position = calculateTaskPosition(
                    task,
                    startDate,
                    effectiveCellWidth,
                  );
                  return (
                    <div
                      key={task.id}
                      {...getStyles('taskRow')}
                      style={{
                        height: `${rowHeight}px`,
                        top: idx * rowHeight,
                      }}
                    >
                      <div
                        {...getStyles('taskBar')}
                        style={{
                          left: position.left,
                          width: position.width,
                          height: `${rowHeight * 0.6}px`,
                          backgroundColor:
                            task.type === 'summary'
                              ? 'var(--mantine-color-blue-6)'
                              : task.type === 'milestone'
                                ? 'var(--mantine-color-orange-6)'
                                : 'var(--mantine-color-cyan-6)',
                        }}
                        title={`${task.text}: ${formatDate(task.start)} - ${formatDate(task.end)}`}
                      >
                        {task.progress && task.progress > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: `${task.progress}%`,
                              backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Draw links */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: tasks.length * rowHeight,
                    pointerEvents: 'none',
                  }}
                >
                  {links.map((link) => {
                    const sourceTask = tasks.find((t) => t.id === link.source);
                    const targetTask = tasks.find((t) => t.id === link.target);
                    if (!sourceTask || !targetTask) return null;

                    const sourceIdx = tasks.findIndex((t) => t.id === link.source);
                    const targetIdx = tasks.findIndex((t) => t.id === link.target);

                    const sourcePos = calculateTaskPosition(
                      sourceTask,
                      startDate,
                      effectiveCellWidth,
                    );
                    const targetPos = calculateTaskPosition(
                      targetTask,
                      startDate,
                      effectiveCellWidth,
                    );

                    const x1 = sourcePos.left + sourcePos.width;
                    const y1 = sourceIdx * rowHeight + rowHeight / 2;
                    const x2 = targetPos.left;
                    const y2 = targetIdx * rowHeight + rowHeight / 2;

                    return (
                      <g key={link.id}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="var(--mantine-color-gray-6)"
                          strokeWidth="2"
                        />
                        <polygon
                          points={`${x2},${y2} ${x2 - 6},${y2 - 4} ${x2 - 6},${y2 + 4}`}
                          fill="var(--mantine-color-gray-6)"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Box>
  );
});

Gantt.displayName = 'Gantt';
Gantt.classes = classes;
