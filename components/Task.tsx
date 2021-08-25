import React, { FC, useEffect, useMemo, useRef } from 'react'
import ContentEditable from 'react-contenteditable'
import useEffectAfterMount from '../hooks/useEffectAfterMount'
import usePropAsState from '../hooks/usePropAsState'
import useRefCallback from '../hooks/useRefCallback'

export interface TaskOnChangeEvent {
  id: number
  completed: boolean
  name: string
}

export interface TaskOnAddClickEvent {
  id: number
}
export interface TaskOnDeleteEvent {
  id: number
}
export interface TaskOnIndentEvent {
  id: number
}

interface TaskProps {
  id: number
  name: string
  completed?: boolean
  subtasks?: TaskProps[]
  focus?: boolean | number
  onChange?: (event: TaskOnChangeEvent) => void
  onAddClick?: (event: TaskOnAddClickEvent) => void
  onDelete?: (event: TaskOnDeleteEvent) => void
  onIndent?: (event: TaskOnIndentEvent) => void
}

function debounce(callback: Function, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), delay)
  }
}

const Task: FC<TaskProps> = ({
  id,
  name,
  completed = false,
  subtasks,
  onChange,
  onAddClick,
  onDelete,
  onIndent,
  focus = false,
}) => {
  const [checked, setChecked] = usePropAsState(completed)
  const [taskName, setTaskName] = usePropAsState(name)
  const [childTasks, setChildTasks] = usePropAsState(subtasks)
  const inputRef = useRef<any>(null)

  useEffect(() => {
    if (focus !== undefined && inputRef?.current) {
      if (typeof focus === 'boolean' && focus) inputRef.current.getEl().focus()
      else if (typeof focus === 'number') {
        if (focus === 0) {
          inputRef.current.getEl().focus()
        } else {
          const node = inputRef.current.getEl().childNodes[0]
          const range = document.createRange()
          range.setStart(node, focus)
          range.setEnd(node, focus)
          const sel = window.getSelection()
          sel?.removeAllRanges()
          sel?.addRange(range)
        }
      }
    }
  }, [focus])

  const debouncedOnChange = useMemo(() => {
    if (onChange) return debounce(onChange, 500)
  }, [])

  useEffectAfterMount(() => {
    if (checked)
      setChildTasks(prev => prev?.map(x => ({ ...x, completed: checked })))
    else if (childTasks?.every(x => x.completed))
      setChildTasks(prev => prev?.map(x => ({ ...x, completed: checked })))
    if (onChange) onChange({ id, completed: checked, name: taskName })
  }, [checked])

  const handleSubtaskChange = (e: TaskOnChangeEvent) => {
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

  useEffectAfterMount(() => {
    if (debouncedOnChange)
      debouncedOnChange({ id, completed: checked, name: taskName })
  }, [taskName])

  const handleAddClick = () => {
    if (onAddClick) onAddClick({ id })
  }

  const handleDelete = () => {
    if (onDelete) onDelete({ id })
  }

  const handleIndent = () => {
    if (onIndent) onIndent({ id })
  }

  const handleKeyDown = useRefCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          handleAddClick()
          break
        case 'Backspace':
          if (taskName.length > 0) return
          e.preventDefault()
          handleDelete()
          break
        case 'Tab':
          e.preventDefault()
          handleIndent()
          break
      }
    },
    [taskName, handleAddClick, handleDelete],
  )

  return (
    <>
      <div className="flex p-1 group -ml-14">
        <button
          onClick={handleAddClick}
          className="self-start text-lg px-2 text-gray-400 transition-all rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200"
        >
          +
        </button>
        <button className="self-start cursor-move text-lg px-1 text-gray-400 transition-all rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 mr-2">
          ⠿
        </button>
        <input
          type="checkbox"
          checked={checked}
          className="mt-1 cursor-pointer focus:ring-offset-0 focus:ring-black h-4 w-4 text-purple-600 rounded hover:bg-gray-200"
          onChange={e => setChecked(e.target.checked)}
        />
        <ContentEditable
          className={`focus:outline-none w-full ml-2 ${
            checked ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
          html={taskName}
          onChange={e => setTaskName(e.target.value)}
          ref={inputRef}
          placeholder="To-do"
          onKeyDown={handleKeyDown}
        />
      </div>
      {childTasks && childTasks.length > 0 && (
        <div className="ml-8">
          {childTasks.map(x => (
            <Task
              key={x.id}
              {...x}
              onChange={handleSubtaskChange}
              onAddClick={onAddClick}
              onDelete={onDelete}
              onIndent={onIndent}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Task
