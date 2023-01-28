import {RequestStatusType} from '../common/types/Types';
import {AppReducerActionType} from '../redux/actions/actionApp';

const initState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
    login: ''
}

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

