import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';
import {AppThunk} from '../redux/store';
import {RequestStatusType, setAppStatusAC} from './appReducer';
import axios from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {TodoListFilterType} from '../components/TodolistMain';
import {fetchTasksTC} from './tasksReducer';

const initState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(i => i.id !== action.todoListId)
        }

        case 'CHANGE_TODOLIST_TITLE': {
            return state.map(i => i.id === action.todoListId ? {...i, title: action.title} : i)
        }

        case 'ADD_TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }

        case 'CHANGE_TODOLIST_FILTER': {
            return state.map(i => i.id === action.todoListId ? {...i, filter: action.value} : i)
        }

        case 'SET-TODOLISTS': {
            return action.todolists.map(i => ({...i, filter: 'all', entityStatus: 'idle'}))
        }

        case 'TODO/DISABLED-ONE-TODOLIST': {
            return state.map(i => i.id === action.todoListId ? {...i, entityStatus: action.status} : i)
        }

        default: {
            return state
        }
    }
};

//action creator
export const removeTodoListAC = (todoListId: string) => ({type: 'REMOVE_TODOLIST', todoListId} as const)
export const changeTodoListTitleAC = (todoListId: string, title: string) => ({
    type: 'CHANGE_TODOLIST_TITLE',
    todoListId,
    title
} as const)
//here forward todolist because this todolist return server. Server return all todolist not only one value
export const addTodoListAC = (todolist: TodolistType) => ({type: 'ADD_TODOLIST', todolist} as const)
export const changeFilterAC = (todoListId: string, value: TodoListFilterType) => ({
    type: 'CHANGE_TODOLIST_FILTER',
    todoListId,
    value
} as const)
export const setTodoAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists: todolists} as const)
export const disabledOneTodolistAC = (todoListId: string, status: RequestStatusType) => ({
    type: 'TODO/DISABLED-ONE-TODOLIST',
    todoListId,
    status
} as const)


//thunk
//here dispatched thunk in thunk and my dispatch type is universal  - remove word  ,Dispatch,
export const getTodoTC = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.getTodolist()
        if (res.data) {
            dispatch(setTodoAC(res.data))
            dispatch(setAppStatusAC('sucssesed'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        await res.data.forEach(t => {
            dispatch(fetchTasksTC(t.id))
        })
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const addTodoListTC = (title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {  //0 - this is victory
            dispatch(addTodoListAC(res.data.data.item))
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

export const removeTodoListTC = (todoListId: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(disabledOneTodolistAC(todoListId, 'loading'))
        await todolistAPI.removeTodolist(todoListId)
        dispatch(removeTodoListAC(todoListId))
        dispatch(setAppStatusAC('sucssesed'))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(disabledOneTodolistAC(todolistId, 'loading'))
        await todolistAPI.updateTodolist(todolistId, title)
        dispatch(changeTodoListTitleAC(todolistId, title))
        dispatch(setAppStatusAC('sucssesed'))
        dispatch(disabledOneTodolistAC(todolistId, 'sucssesed'))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}
//type
export type TodolistActionsType = ReturnType<typeof removeTodoListAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodoAC>
    | ReturnType<typeof disabledOneTodolistAC>

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}