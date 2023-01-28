// generic function
import {ResponseType} from '../common/types/Types';
import {Dispatch} from 'redux';
import {AppReducerActionType, setAppErrorAC, setAppStatusAC} from '../redux/actions/actionApp';

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<AppReducerActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<AppReducerActionType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}

