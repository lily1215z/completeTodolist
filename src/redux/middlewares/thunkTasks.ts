import {Dispatch} from 'redux';
import {setAppStatusAC} from '../actions/actionApp';
import {todolistAPI} from '../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import axios from 'axios';
import {AppRootState, AppThunk} from '../store';
import {RESULT_CODE_RESPONSE} from '../../common/enums/Server_response_code';
import {
    UpdateDomainTaskModelType,
    UpdateTaskModelType
} from '../../common/types/Types';
import {addTasksAC, removeTasksAC, setTasksAC, updateTaskAC} from '../actions/actionsTasks';
import {disabledOneTodolistAC} from '../actions/actionTodolists';

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
            console.log(task)
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

