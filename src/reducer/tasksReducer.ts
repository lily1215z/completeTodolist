import {addTodoListAC, disabledOneTodolistAC, removeTodoListAC, setTodoAC} from './todolistReducer';
import {Dispatch} from 'redux';
import {todolistAPI} from '../api/todolist-api';
import {AppRootState, AppThunk} from '../redux/store';
import {setAppStatusAC} from './appReducer';
import axios from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {TaskPriorities, TaskStatuses, TasksType, TaskType, UpdateTaskModelType} from '../common/types/Types';
import {RESULT_CODE_RESPONSE} from '../common/enums/Server_response_code';

const initState: TasksType = {}

export const tasksReducer = (state: TasksType = initState, action: TasksActionsType): TasksType => {
    switch (action.type) {
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(i => i.id !== action.taskId)}

        case 'ADD_TASK':
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}

        case 'ADD_TODOLIST':
            return {...state, [action.todolist.id]: []}

        case 'REMOVE_TODOLIST':
            const copyState = {...state};
            delete copyState[action.todoListId];
            return copyState;

        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }

        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            //in every todolist create key and add empty array in this todolist where will be tasks
            action.todolists.forEach(i => stateCopy[i.id] = [])
            return stateCopy
        }

        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}

        default:
            return state
    }
};

//actions creator
export const removeTasksAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE_TASK', todolistId, taskId} as const)
export const addTasksAC = (todolistId: string, task: TaskType) =>
    ({type: 'ADD_TASK', todolistId, task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)

//thunks
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.getTasks(todolistId)
        if (res.data.items) {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setAppStatusAC('sucssesed'))
        } else {
            handleServerAppError(res.data.items, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}


export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(disabledOneTodolistAC(todolistId, 'loading'))
        await todolistAPI.removeTask(todolistId, taskId)
        dispatch(removeTasksAC(todolistId, taskId))
        dispatch(setAppStatusAC('sucssesed'))
        dispatch(disabledOneTodolistAC(todolistId, 'sucssesed'))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const addTasksTC = (todolistId: string, title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))  // show loader
        dispatch(disabledOneTodolistAC(todolistId, 'loading'))
        const res = await todolistAPI.createTask(todolistId, title)
        if (res.data.resultCode === RESULT_CODE_RESPONSE.SUCCESS) {
            dispatch(addTasksAC(todolistId, res.data.data.item))
            dispatch(setAppStatusAC('sucssesed'))       //remove loader
            dispatch(disabledOneTodolistAC(todolistId, 'sucssesed'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk => {
    return async (dispatch, getState: () => AppRootState) => {
        try {
            const state = getState()
            const task = state.tasks[todolistId].find(i => i.id === taskId)
            if (!task) {
                console.warn('task not found in the state')
                return
            }
            const apiModel: UpdateTaskModelType = {   // this we send. type is different
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                //something come in UA, need rechange and other leave without change
                ...domainModel
            }
            dispatch(setAppStatusAC('loading'))
            dispatch(disabledOneTodolistAC(todolistId, 'loading'))
            await todolistAPI.updateTask(todolistId, taskId, apiModel)

            dispatch(updateTaskAC(taskId, domainModel, todolistId))
            dispatch(disabledOneTodolistAC(todolistId, 'sucssesed'))
            dispatch(setAppStatusAC('sucssesed'))

        } catch (e) {
            if (axios.isAxiosError(e)) {
                handleServerNetworkError(e, dispatch)
            }
        }
    }
}

//type
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksActionsType = ReturnType<typeof removeTasksAC>
    | ReturnType<typeof addTasksAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof removeTodoListAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof setTodoAC>
    | ReturnType<typeof updateTaskAC>