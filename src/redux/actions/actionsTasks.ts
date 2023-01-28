import {TaskType, UpdateDomainTaskModelType} from '../../common/types/Types';
import {addTodoListAC, removeTodoListAC, setTodoAC} from './actionTodolists';

export const removeTasksAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE_TASK', todolistId, taskId} as const)

export const addTasksAC = (todolistId: string, task: TaskType) =>
    ({type: 'ADD_TASK', todolistId, task} as const)

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)

export type TasksActionsType = ReturnType<typeof removeTasksAC>
    | ReturnType<typeof addTasksAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof removeTodoListAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof setTodoAC>
    | ReturnType<typeof updateTaskAC>