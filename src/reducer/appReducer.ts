export type RequestStatusType = 'idle' | 'loading' | 'sucssesed' | 'failed';
const initState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}
type initStateType = typeof initState;

// type initStateType = {
//     status: RequestStatusType
//     error: null | string
// }
// const initState: initStateType = {
//     status: 'idle',
//     error: 'some erroooooor'
// }

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

export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}

export const setAppErrorAC = (error: null | string) => {
    return {type: 'APP/SET-ERROR', error} as const
}

export type AppReducerActionType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>
