import { FC } from 'react'
import usePropAsState from '../hooks/usePropAsState'
import Task, {
  IndentType,
  TaskOnAddClickEvent,
  TaskOnChangeEvent,
  TaskOnDeleteEvent,
  TaskOnIndentEvent,
} from './Task'

export interface TaskItem {
  id: number
  name: string
  completed?: boolean
  focus?: boolean | number
  subtasks?: TaskItem[]
}

interface TasksProps {
  defaultTasks: TaskItem[]
}

function findTask(tasks: TaskItem[], id: number): number[] {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]
    if (task.id === id) return [i]
    if (task.subtasks) {
      let res = findTask(task.subtasks, id)
      if (res.length !== 0) return [i, ...res]
    }
  }
  return []
}

function insertTask(
  tasks: TaskItem[] | undefined,
  taskIndex: number[],
  newTask: TaskItem,
): TaskItem[] {
  const taskIndexCopy = [...taskIndex]
  const index = taskIndexCopy.shift()
  if (index === undefined || tasks === undefined) {
    return []
  } else
    return [
      ...tasks
        .slice(0, taskIndexCopy.length > 0 ? index : index + 1)
        .map(x => ({ ...x, focus: false })),
      taskIndexCopy.length > 0
        ? {
            ...tasks[index],
            subtasks: insertTask(tasks[index].subtasks, taskIndexCopy, newTask),
            focus: false,
          }
        : newTask,
      ...tasks.slice(index + 1).map(x => ({ ...x, focus: false })),
    ]
}

function removeTask(
  tasks: TaskItem[] | undefined,
  taskIndex: number[],
): TaskItem[] {
  const taskIndexCopy = [...taskIndex]
  const index = taskIndexCopy.shift()
  if (index === undefined || tasks === undefined) {
    return []
  } else {
    if (taskIndexCopy.length === 0)
      if (index === 0) return [{ ...tasks[1], focus: true }, ...tasks.slice(2)]
      else
        return [
          ...tasks.slice(0, index - 1),
          { ...tasks[index - 1], focus: tasks[index - 1].name.length },
          ...tasks.slice(index + 1),
        ]
    return [
      ...tasks.slice(0, index),
      {
        ...tasks[index],
        subtasks:
          tasks[index].subtasks?.length === 1
            ? []
            : removeTask(tasks[index].subtasks, taskIndexCopy),
        focus:
          tasks[index].subtasks?.length === 1
            ? tasks[index].name.length
            : false,
      },
      ...tasks.slice(index + 1),
    ]
  }
}

function indentTask(
  tasks: TaskItem[] | undefined,
  taskIndex: number[],
): TaskItem[] {
  const taskIndexCopy = [...taskIndex]
  const index = taskIndexCopy.shift()
  if (index === undefined || tasks === undefined) return []
  if (index === 0 && taskIndexCopy.length === 0) return tasks
  if (taskIndexCopy.length === 0)
    return [
      ...tasks.slice(0, index - 1),
      {
        ...tasks[index - 1],
        subtasks: (tasks[index - 1].subtasks
          ? tasks[index - 1].subtasks
          : []
        )?.concat({
          ...tasks[index],
          focus: tasks[index].name.length,
        }),
      },
      ...tasks.slice(index + 1),
    ]
  return [
    ...tasks.slice(0, index),
    {
      ...tasks[index],
      subtasks: indentTask(tasks[index].subtasks, taskIndexCopy),
    },
    ...tasks.slice(index + 1),
  ]
}

function deIndentTask(
  tasks: TaskItem[] | undefined,
  taskIndex: number[],
): TaskItem[] {
  const taskIndexCopy = [...taskIndex]
  const index = taskIndexCopy.shift()
  if (index === undefined || tasks === undefined) return []
  if (index === 0 && taskIndexCopy.length === 0) return tasks
  if (taskIndexCopy.length === 1)
    return [
      ...tasks.slice(0, index),
      {
        ...tasks[index],
        subtasks: tasks[index].subtasks?.filter(
          (x, i) => i !== taskIndexCopy[0],
        ),
      },
      (tasks[index].subtasks ?? [])[taskIndexCopy[0]],
      ...tasks.slice(index + 1),
    ]
  return [
    ...tasks.slice(0, index),
    {
      ...tasks[index],
      subtasks: deIndentTask(tasks[index].subtasks, taskIndexCopy),
    },
    ...tasks.slice(index + 1),
  ]
}

function updateTasks(
  tasks: TaskItem[] | undefined,
  taskIndex: number[],
  taskChange: TaskOnChangeEvent,
): TaskItem[] {
  const taskIndexCopy = [...taskIndex]
  const index = taskIndexCopy.shift()
  if (tasks === undefined) return []
  if (taskIndexCopy.length === 0)
    return tasks.map(task =>
      task.id === taskChange.id ? { ...task, ...taskChange } : task,
    )
  else
    return tasks.map((task, i) =>
      i === index
        ? {
            ...task,
            subtasks: updateTasks(task.subtasks, taskIndexCopy, taskChange),
          }
        : task,
    )
}

const Tasks: FC<TasksProps> = ({ defaultTasks }) => {
  const [tasks, setTasks] = usePropAsState(defaultTasks)

  const handleTaskChange = (e: TaskOnChangeEvent) => {
    const taskIndex = findTask(tasks, e.id)
    if (taskIndex.length === 0) return

    setTasks(prevTasks => updateTasks(prevTasks, taskIndex, e))
  }

  const handleAddClick = ({ id }: TaskOnAddClickEvent) => {
    const taskIndex = findTask(tasks, id)
    if (taskIndex.length === 0) return

    const newItem: TaskItem = {
      // TODO: Change ID generation logic
      id: Math.floor(Math.random() * 10000) + 100,
      name: '',
      completed: false,
      subtasks: [],
      focus: true,
    }
    setTasks(prevTasks => insertTask(prevTasks, taskIndex, newItem))
  }

  const handleDeleteTask = ({ id }: TaskOnDeleteEvent) => {
    const taskIndex = findTask(tasks, id)
    if (taskIndex.length === 0 || tasks.length === 1) return

    setTasks(prevTasks => removeTask(prevTasks, taskIndex))
  }

  const handleIndent = ({ id, indentType }: TaskOnIndentEvent) => {
    const taskIndex = findTask(tasks, id)
    if (taskIndex.length === 0) return

    if (indentType === IndentType.INDENT)
      setTasks(prevTasks => indentTask(prevTasks, taskIndex))
    else if (indentType === IndentType.DEINDENT && taskIndex.length > 1) {
      setTasks(prevTasks => deIndentTask(prevTasks, taskIndex))
    }
  }

  return (
    <>
      {tasks.map(x => (
        <Task
          key={x.id}
          {...x}
          onChange={handleTaskChange}
          onAddClick={handleAddClick}
          onDelete={handleDeleteTask}
          onIndent={handleIndent}
        />
      ))}
    </>
  )
}

export default Tasks
