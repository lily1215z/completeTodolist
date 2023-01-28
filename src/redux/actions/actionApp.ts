import {RequestStatusType} from '../../common/types/Types';

export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: null | string) => {
    return {type: 'APP/SET-ERROR', error} as const
}

export const setIsInitializedAC = (value: boolean) => {
    return {type: 'APP/INITIALIZE-APP', value} as const
}

export const getLoginNameAC = (login: string) => {
    return {type: 'APP/GET-LOGIN-NAME', login} as const
}

export type AppReducerActionType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setIsInitializedAC> | ReturnType<typeof getLoginNameAC>