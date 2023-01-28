import {Dispatch} from 'redux';
import {authAPI} from '../../api/todolist-api';
import {RESULT_CODE_RESPONSE} from '../../common/enums/Server_response_code';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import axios from 'axios';
import {getLoginNameAC, setAppStatusAC, setIsInitializedAC} from '../actions/actionApp';
import {setIsLoggedInAC} from '../actions/actionAuth';

export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE_RESPONSE.SUCCESS) {
            dispatch(setIsLoggedInAC(true))
            dispatch(getLoginNameAC(res.data.data.login))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setIsInitializedAC(true))
        dispatch(setAppStatusAC('sucssesed'))
    }
}