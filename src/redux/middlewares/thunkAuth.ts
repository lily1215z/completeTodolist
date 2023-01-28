//thunk
import {LoginParamsType} from '../../common/types/Types';
import {AppThunk} from '../store';
import {Dispatch} from 'redux';
import {setAppStatusAC} from '../actions/actionApp';
import {authAPI} from '../../api/todolist-api';
import {RESULT_CODE_RESPONSE} from '../../common/enums/Server_response_code';
import {setIsLoggedInAC} from '../actions/actionAuth';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import axios from 'axios';

export const loginTC = (dataLoginForm: LoginParamsType): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.login(dataLoginForm)
        if(res.data.resultCode === RESULT_CODE_RESPONSE.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('sucssesed'))
        }
        else {
            handleServerAppError(res.data, dispatch)
        }
    } catch(e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}


export const logoutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODE_RESPONSE.SUCCESS) {
            dispatch(setIsLoggedInAC(false))
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
