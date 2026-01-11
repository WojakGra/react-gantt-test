import React from 'react';
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
} from '@mantine/core';
import classes from './Gantt.module.css';

export type GanttStylesNames = 'root' | 'grid' | 'chart' | 'toolbar';
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

export const Gantt = factory<GanttFactory>((_props, ref) => {
  const props = useProps('Gantt', defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    tasks,
    ...others
  } = props;

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

  return (
    <Box ref={ref} {...getStyles('root')} {...others}>
      <div {...getStyles('toolbar')}>
        {/* Toolbar will be implemented here */}
        <div>Gantt Toolbar</div>
      </div>
      <div {...getStyles('grid')}>
        {/* Grid will be implemented here */}
        <div>Gantt Grid - {tasks?.length || 0} tasks</div>
      </div>
      <div {...getStyles('chart')}>
        {/* Chart will be implemented here */}
        <div>Gantt Chart</div>
      </div>
    </Box>
  );
});

Gantt.displayName = 'Gantt';
Gantt.classes = classes;
