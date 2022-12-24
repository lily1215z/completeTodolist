import {Dispatch} from 'redux';
import {authAPI} from '../api/todolist-api';
import {setIsLoggedInAC} from './authReducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import axios from 'axios';

export type RequestStatusType = 'idle' | 'loading' | 'sucssesed' | 'failed';

const initState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
    login: ''
}
// type AppReducerType = typeof initState;
type AppReducerType = {
    status: RequestStatusType,
    error: null | string,
    isInitialized: boolean,
    login: string
}

export const appReducer = (state: AppReducerType = initState, action: AppReducerActionType): AppReducerType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        case 'APP/INITIALIZE-APP': {
            return {...state, isInitialized: action.value}
        }
        case 'APP/GET-LOGIN-NAME': {
            return {...state, login: action.login}
        }
        default:
            return state
    }
}

//action creator
export const setAppStatusAC = (status: RequestStatusType) => {  //статус крутилки
    return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: null | string) => {  //сделали компоненту ErrorSnackbar контролируемой
    return {type: 'APP/SET-ERROR', error} as const
}
export const setIsInitializedAC = (value: boolean) => {  //me запрос
    return {type: 'APP/INITIALIZE-APP', value} as const
}
export const getLoginNameAC = (login: string) => {
    return {type: 'APP/GET-LOGIN-NAME', login} as const
}

//thunk
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))  //покажет крутилку
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(getLoginNameAC(res.data.data.login))
        } else {
            handleServerAppError(res.data, dispatch) //ошибки наши
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)  //др ошибки
        }
    } finally {
        dispatch(setIsInitializedAC(true))
        dispatch(setAppStatusAC('sucssesed'))  //уберет крутилку
    }
}


//type
export type AppReducerActionType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setIsInitializedAC> | ReturnType<typeof getLoginNameAC>
