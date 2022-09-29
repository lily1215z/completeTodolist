import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TodolistActionsType, todolistsReducer} from "../reducer/todolistReducer";
import {TasksActionsType, tasksReducer} from "../reducer/tasksReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootState = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootState, unknown, AppActionType>
export type AppActionType = TodolistActionsType | TasksActionsType

export type AppThunk<ReturnType = void> = ThunkAction<void, AppRootState, unknown, AppActionType>
//@ts-ignore
window.store = store