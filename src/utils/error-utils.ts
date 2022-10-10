// generic function
import {AppReducerActionType, setAppErrorAC, setAppStatusAC} from '../reducer/appReducer';
import {ResponseType} from '../api/todolist-api';
import {Dispatch} from 'redux';

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<AppReducerActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<AppReducerActionType>) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}
