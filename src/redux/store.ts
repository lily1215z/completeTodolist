import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TodolistActionsType, todolistsReducer} from "../reducer/todolistReducer";
import {TasksActionsType, tasksReducer} from "../reducer/tasksReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer, AppReducerActionType} from '../reducer/appReducer';
import {authReducer, AuthReducerActionType} from '../reducer/authReducer';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootState = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootState, unknown, AppActionType>
export type AppActionType = TodolistActionsType | TasksActionsType | AppReducerActionType | AuthReducerActionType

export type AppThunk<ReturnType = void> = ThunkAction<void, AppRootState, unknown, AppActionType>

//@ts-ignore
window.store = store