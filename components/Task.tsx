import { FC, useState } from 'react'

interface TaskProps {
  name: string
  completed?: boolean
  subtasks?: TaskProps[]
}

export const Task: FC<TaskProps> = ({ name, completed = false, subtasks }) => {
  const [done, setDone] = useState(completed)

  return (
    <>
      <div onClick={() => setDone(x => !x)}>
        <label className={done ? 'line-through' : ''}>
          <input type="checkbox" checked={done} /> {name}
        </label>
      </div>
      {subtasks && (
        <div className="ml-4">
          {subtasks.map(x => (
            <Task {...x} />
          ))}
        </div>
      )}
    </>
  )
}
