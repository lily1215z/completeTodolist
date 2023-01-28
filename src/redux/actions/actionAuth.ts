
export const setIsLoggedInAC = (value: boolean) => {
    return {type: 'login/SET-IS-LOGGED-IN', value} as const
}

export type AuthReducerActionType = ReturnType<typeof setIsLoggedInAC>