import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../api/todolist-api';
import {AppThunk} from '../redux/store';
import {setAppStatusAC} from './appReducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import axios from 'axios';


const initialState = {
    isLoggedIn: false,
}
// type AuthReducerType = typeof initialState;
type AuthReducerType = {
    isLoggedIn: boolean,
}

export const authReducer = (state: AuthReducerType = initialState, action: AuthReducerActionType): AuthReducerType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN': {
            return {...state, isLoggedIn: action.value}
        }

        default:
            return state
    }
};

// action creator
export const setIsLoggedInAC = (value: boolean) => {
    return {type: 'login/SET-IS-LOGGED-IN', value} as const
}

//thunk
export const loginTC = (dataLoginForm: LoginParamsType): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))  //покажет крутилку
        const res = await authAPI.login(dataLoginForm)
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('sucssesed'))  //уберет крутилку
        }
        else {
            handleServerAppError(res.data, dispatch) //ошибки наши
        }
    } catch(e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)  //др ошибки
        }
    }
}


export const logoutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))  //покажет крутилку
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('sucssesed'))  //уберет крутилку
        } else {
            handleServerAppError(res.data, dispatch) //ошибки наши
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)  //др ошибки
        }
    }

}

//type
export type AuthReducerActionType = ReturnType<typeof setIsLoggedInAC>