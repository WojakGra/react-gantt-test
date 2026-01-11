import React from 'react';
import {
  Modal,
  TextInput,
  Select,
  NumberInput,
  Button,
  Group,
  Stack,
  Input,
} from '@mantine/core';
import { Task } from './Gantt';

export interface TaskFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialValues?: Partial<Task>;
  existingTasks?: Task[];
}

export function TaskForm({
  opened,
  onClose,
  onSubmit,
  initialValues,
  existingTasks = [],
}: TaskFormProps) {
  const [formData, setFormData] = React.useState<{
    text: string;
    start: string;
    end: string;
    progress: number;
    type: 'task' | 'summary' | 'milestone';
    parent: string | null;
  }>({
    text: initialValues?.text || '',
    start: initialValues?.start
      ? initialValues.start.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    end: initialValues?.end
      ? initialValues.end.toISOString().split('T')[0]
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
    progress: initialValues?.progress || 0,
    type: initialValues?.type || 'task',
    parent: initialValues?.parent?.toString() || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text || !formData.start || !formData.end) {
      return;
    }

    const task: Omit<Task, 'id'> = {
      text: formData.text,
      start: new Date(formData.start),
      end: new Date(formData.end),
      progress: formData.progress,
      type: formData.type,
      ...(formData.parent ? { parent: formData.parent } : {}),
    };

    onSubmit(task);
    onClose();

    // Reset form
    setFormData({
      text: '',
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      progress: 0,
      type: 'task',
      parent: null,
    });
  };

  const parentOptions = existingTasks
    .filter((t) => t.type === 'summary')
    .map((t) => ({
      value: t.id.toString(),
      label: t.text,
    }));

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Task" size="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Task Name"
            placeholder="Enter task name"
            required
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />

          <Select
            label="Task Type"
            data={[
              { value: 'task', label: 'Task' },
              { value: 'summary', label: 'Summary' },
              { value: 'milestone', label: 'Milestone' },
            ]}
            value={formData.type}
            onChange={(value) =>
              setFormData({
                ...formData,
                type: value as 'task' | 'summary' | 'milestone',
              })
            }
          />

          {parentOptions.length > 0 && (
            <Select
              label="Parent Task"
              placeholder="Select parent task (optional)"
              data={parentOptions}
              value={formData.parent}
              onChange={(value) => setFormData({ ...formData, parent: value })}
              clearable
            />
          )}

          <Input.Wrapper label="Start Date" required>
            <Input
              type="date"
              value={formData.start}
              onChange={(e) =>
                setFormData({ ...formData, start: e.target.value })
              }
              required
            />
          </Input.Wrapper>

          <Input.Wrapper label="End Date" required>
            <Input
              type="date"
              value={formData.end}
              onChange={(e) =>
                setFormData({ ...formData, end: e.target.value })
              }
              min={formData.start}
              required
            />
          </Input.Wrapper>

          <NumberInput
            label="Progress (%)"
            placeholder="0"
            min={0}
            max={100}
            value={formData.progress}
            onChange={(value) =>
              setFormData({ ...formData, progress: Number(value) || 0 })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
