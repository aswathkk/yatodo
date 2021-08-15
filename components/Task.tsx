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
      <div className="flex items-center p-1 group -ml-14">
        <button className="text-lg px-2 text-gray-400 transition-all rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200">
          +
        </button>
        <button className="cursor-move text-lg px-1 text-gray-400 transition-all rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 mr-2">
          ⠿
        </button>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={checked}
            className="cursor-pointer focus:ring-offset-0 focus:ring-black h-5 w-5 text-purple-600 rounded hover:bg-gray-200"
            onChange={e => setChecked(e.target.checked)}
          />
          <div
            className={`ml-2 text-gray-700 ${checked ? 'line-through' : ''}`}
          >
            {name}
          </div>
        </label>
      </div>
      {childTasks && childTasks.length > 0 && (
        <div className="ml-8">
          {childTasks.map(x => (
            <Task key={x.id} {...x} onChange={handleSubtaskChange} />
          ))}
        </div>
      )}
    </>
  )
}

export default Task
