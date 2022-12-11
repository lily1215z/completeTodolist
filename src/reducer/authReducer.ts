import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../api/todolist-api';
import {AppThunk} from '../redux/store';


const initialState = {
    isLoggedIn: false
}
type AuthReducerType = typeof initialState;

export const authReducer = (state: AuthReducerType = initialState, action: AuthReducerActionType): AuthReducerType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN': {
            return {...state, isLoggedIn: action.value}
        }

        default: return state
    }
};

// action creator
export const setIsLoggedInAC = (value: boolean) => {
    return {type: 'login/SET-IS-LOGGED-IN', value} as const
}

//thunk
export const loginTC = (dataLoginForm: LoginParamsType): AppThunk => async (dispatch: Dispatch) => {
    const res = await authAPI.login(dataLoginForm)
    if(res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
    }
}

//type
export type AuthReducerActionType = ReturnType<typeof setIsLoggedInAC>