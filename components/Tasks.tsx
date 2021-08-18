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

const Tasks: FC<TasksProps> = ({ defaultTasks }) => {
  const [tasks, setTasks] = usePropAsState(defaultTasks)

  const handleTaskChange = (e: TaskOnChangeEvent) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === e.id ? { ...task, ...e } : task)),
    )
  }

  const handleAddClick = ({ id }: TaskOnAddClickEvent) => {
    const index = tasks.map(x => x.id).indexOf(id)
    const newItem: TaskItem = {
      // TODO: Change ID generation logic
      id: Math.floor(Math.random() * 10000) + 100,
      name: '',
      focus: true,
    }
    setTasks(prevTasks => [
      ...prevTasks.slice(0, index + 1),
      newItem,
      ...prevTasks.slice(index + 1),
    ])
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
