import React, { FC, useEffect, useRef, useState } from 'react'
import useEffectAfterMount from '../hooks/useEffectAfterMount'
import usePropAsState from '../hooks/usePropAsState'

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
  const [checked, setChecked] = usePropAsState(completed)
  const [childTasks, setChildTasks] = usePropAsState(subtasks)

  useEffectAfterMount(() => {
    if (checked)
      setChildTasks(prev => prev?.map(x => ({ ...x, completed: checked })))
    else if (childTasks?.every(x => x.completed))
      setChildTasks(prev => prev?.map(x => ({ ...x, completed: checked })))
    if (onChange) onChange({ id, completed: checked })
  }, [checked])

  const handleSubtaskChange = (e: TaskEvent) => {
    setChildTasks(prev =>
      prev?.map(x => (x.id == e.id ? { ...x, completed: e.completed } : x)),
    )
    if (onChange) onChange(e)
  }

  useEffectAfterMount(() => {
    if (childTasks && childTasks?.length > 0) {
      if (childTasks.every(x => x.completed)) setChecked(true)
      else setChecked(false)
    }
  }, [childTasks])

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
            <Task key={x.id} {...x} onChange={handleSubtaskChange} />
          ))}
        </div>
      )}
    </>
  )
}

export default Task
