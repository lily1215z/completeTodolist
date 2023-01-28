import {AuthReducerActionType} from '../redux/actions/actionAuth';


const initialState = {
    isLoggedIn: false,
}

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

