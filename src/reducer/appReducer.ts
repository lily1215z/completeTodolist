import {Dispatch} from 'redux';
import {authAPI} from '../api/todolist-api';
import {setIsLoggedInAC} from './authReducer';

export type RequestStatusType = 'idle' | 'loading' | 'sucssesed' | 'failed';

const initState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}
type initStateType = typeof initState;

export const appReducer = (state: initStateType = initState, action: AppReducerActionType): initStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        default:
            return state

    }
}

//actopn creator
export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: null | string) => {
    return {type: 'APP/SET-ERROR', error} as const
}


//thunk
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    let res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
    }
}


//type
export type AppReducerActionType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>
