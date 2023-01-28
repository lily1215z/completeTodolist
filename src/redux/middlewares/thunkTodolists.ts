import {AppThunk} from '../store';
import {setAppStatusAC} from '../actions/actionApp';
import {todolistAPI} from '../../api/todolist-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import axios from 'axios';
import {Dispatch} from 'redux';
import {RESULT_CODE_RESPONSE} from '../../common/enums/Server_response_code';
import {
    addTodoListAC,
    changeTodoListTitleAC,
    disabledOneTodolistAC,
    removeTodoListAC,
    setTodoAC
} from '../actions/actionTodolists';
import {fetchTasksTC} from './thunkTasks';

export const getTodoTC = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.getTodolist()
        if (res.data) {
            dispatch(setTodoAC(res.data))
            dispatch(setAppStatusAC('sucssesed'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        await res.data.forEach(t => {
            dispatch(fetchTasksTC(t.id))
        })
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const addTodoListTC = (title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === RESULT_CODE_RESPONSE.SUCCESS) {  //0 - this is victory
            dispatch(addTodoListAC(res.data.data.item))
            dispatch(setAppStatusAC('sucssesed'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const removeTodoListTC = (todoListId: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(disabledOneTodolistAC(todoListId, 'loading'))
        await todolistAPI.removeTodolist(todoListId)
        dispatch(removeTodoListAC(todoListId))
        dispatch(setAppStatusAC('sucssesed'))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(disabledOneTodolistAC(todolistId, 'loading'))
        await todolistAPI.updateTodolist(todolistId, title)
        dispatch(changeTodoListTitleAC(todolistId, title))
        dispatch(setAppStatusAC('sucssesed'))
        dispatch(disabledOneTodolistAC(todolistId, 'sucssesed'))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}