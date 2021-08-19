import { FC } from 'react'
import usePropAsState from '../hooks/usePropAsState'
import Task, {
  TaskOnAddClickEvent,
  TaskOnChangeEvent,
  TaskOnDeleteEvent,
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
      ...tasks.slice(0, taskIndexCopy.length > 0 ? index : index + 1),
      taskIndexCopy.length > 0
        ? {
            ...tasks[index],
            subtasks: insertTask(tasks[index].subtasks, taskIndexCopy, newTask),
          }
        : newTask,
      ...tasks.slice(index + 1),
    ]
}

const Tasks: FC<TasksProps> = ({ defaultTasks }) => {
  const [tasks, setTasks] = usePropAsState(defaultTasks)

  const handleTaskChange = (e: TaskOnChangeEvent) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === e.id ? { ...task, ...e } : task)),
    )
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
    const index = tasks.map(x => x.id).indexOf(id)
    if (tasks.length === 1) return
    if (index === 0)
      setTasks(prevTasks => [
        { ...prevTasks[1], focus: true },
        ...prevTasks.slice(2).map(x => ({ ...x, focus: false })),
      ])
    else
      setTasks(prevTasks => [
        ...prevTasks.slice(0, index - 1).map(x => ({ ...x, focus: false })),
        { ...prevTasks[index - 1], focus: prevTasks[index - 1].name.length },
        ...prevTasks.slice(index + 1).map(x => ({ ...x, focus: false })),
      ])
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
        />
      ))}
    </>
  )
}

export default Tasks
