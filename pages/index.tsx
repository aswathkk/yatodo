import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Tasks, { TaskItem } from '../components/Tasks'

const nestedTasks: TaskItem[] = [
  {
    id: 1,
    name: 'Task 1',
    completed: false,
    subtasks: [
      {
        id: 2,
        name: 'Subtask 1',
        completed: false,
        subtasks: [
          {
            id: 3,
            name: 'Deep Task 1',
            completed: false,
            subtasks: [],
          },
          {
            id: 9,
            name: 'Deep Task 2',
            completed: false,
            subtasks: [],
          },
        ],
      },
      {
        id: 4,
        name: 'Subtask 2',
        completed: true,
        subtasks: [],
      },
    ],
  },
  {
    id: 5,
    name: 'Task 2',
    completed: true,
    subtasks: [],
  },
  {
    id: 6,
    name: 'Task 3',
    completed: false,
    subtasks: [
      {
        id: 7,
        name: 'Subtask 1',
        completed: false,
        subtasks: [],
      },
      {
        id: 8,
        name: 'Subtask 2',
        completed: true,
        subtasks: [],
      },
    ],
  },
]

const simpleTasks: TaskItem[] = [
  {
    id: 1,
    name: 'Task 1',
    completed: false,
  },
  {
    id: 2,
    name: 'Task 2',
    completed: false,
  },
  {
    id: 3,
    name: 'Task 3',
    completed: false,
  },
  {
    id: 4,
    name: 'Task 4 - Which is a task which is lengthy to fit into the display of this test UI',
    completed: false,
  },
]

const Home: NextPage = () => {
  const [taskType, setTaskType] = useState<'simple' | 'nested'>('simple')
  return (
    <div className="max-w-md mx-auto">
      <Head>
        <title>YaTodo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center">
        <h1
          className={`cursor-pointer text-lg text-center mr-4 ${
            taskType === 'simple' ? 'underline' : ''
          }`}
          onClick={() => setTaskType('simple')}
        >
          Simple Tasks
        </h1>
        <h1
          className={`cursor-pointer text-lg text-center ${
            taskType === 'nested' ? 'underline' : ''
          }`}
          onClick={() => setTaskType('nested')}
        >
          Nested Tasks
        </h1>
      </div>
      {taskType === 'simple' && <Tasks defaultTasks={simpleTasks} />}
      {taskType === 'nested' && <Tasks defaultTasks={nestedTasks} />}
    </div>
  )
}

export default Home
