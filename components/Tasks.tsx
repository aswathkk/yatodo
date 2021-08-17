import { FC } from 'react'
import usePropAsState from '../hooks/usePropAsState'
import Task, { TaskOnAddClickEvent, TaskOnChangeEvent } from './Task'

export interface TaskItem {
  id: number
  name: string
  completed?: boolean
  isNew?: boolean
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
      isNew: true,
    }
    setTasks(prevTasks => [
      ...prevTasks.slice(0, index + 1),
      newItem,
      ...prevTasks.slice(index + 1),
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
        />
      ))}
    </>
  )
}

export default Tasks
