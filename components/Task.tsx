import React, { FC, useEffect, useRef, useState } from 'react'

export interface TaskEvent {
  id: number
  completed: boolean
}

interface TaskProps {
  id: number
  name: string
  completed?: boolean
  subtasks?: TaskProps[]
  onChange?: (event: TaskEvent) => void
}

const Task: FC<TaskProps> = ({
  id,
  name,
  completed = false,
  subtasks,
  onChange,
}) => {
  const [checked, setChecked] = useState(completed)
  const [childTasks, setChildTasks] = useState(subtasks)
  const didMountRef = useRef(false)

  useEffect(() => {
    setChecked(completed)
  }, [completed])

  useEffect(() => {
    setChildTasks(subtasks)
  }, [subtasks])

  useEffect(() => {
    if (didMountRef.current) {
      setChildTasks(prev => prev?.map(x => ({ ...x, completed: checked })))
      if (onChange) onChange({ id, completed: checked })
    } else {
      didMountRef.current = true
    }
  }, [checked])

  return (
    <>
      <div>
        <label className={checked ? 'line-through' : ''}>
          <input
            type="checkbox"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
          />{' '}
          {name}
        </label>
      </div>
      {childTasks && (
        <div className="ml-4">
          {childTasks.map(x => (
            <Task key={x.id} {...x} onChange={onChange} />
          ))}
        </div>
      )}
    </>
  )
}

export default Task
