
import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';
import {AppThunk} from '../redux/store';
import {RequestStatusType, setAppStatusAC} from './appReducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {TodoListFilterType} from '../components/TodolistMain';

const initState: Array<TodolistDomainType> = []

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

export const todolistsReducer = (state: Array<TodolistDomainType> = initState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE_TODOLIST': {
            return state.filter(i => i.id !== action.todoListId)
        }

        case 'CHANGE_TODOLIST_TITLE': {
            const todolist = state.find(i => i.id === action.todoListId);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }

        case 'ADD_TODOLIST': {
            // return [{
            //     //id: v1(), //????  id: action.todolistId,
            //     id: action.todolistId,
            //     title: action.title,
            //     filter: 'all'
            // }, ...state]
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }

        case 'CHANGE_TODOLIST_FILTER': {
            let todolistV = state.find(i => i.id === action.todoListId);
            if (todolistV) {
                todolistV.filter = action.value
            }
            return [...state]
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map(i => ({...i, filter: 'all', entityStatus: 'idle'}))
        }
        case 'TODO/DISABLED-ONE-TODOLIST': {
            return state.map(i=>i.id=== action.todoListId ? {...i, entityStatus: action.status} : i)
        }
        default: {
            return state
        }
    }
};

export const removeTodoListAC = (todoListId: string) => {
    return {type: 'REMOVE_TODOLIST', todoListId} as const
}

export const changeTodoListTitleAC = (todoListId: string, title: string) => {
    return {type: 'CHANGE_TODOLIST_TITLE', todoListId, title} as const
}

export const addTodoListAC = (todolist: TodolistType) => {  //здесь передаем тодолист т.к. это то что вернет сервер нам. а он не вернет только один одт значение. оНо вернет весь тодолист
    return {type: 'ADD_TODOLIST', todolist} as const
}

export const changeFilterAC = (todoListId: string, value: TodoListFilterType) => {
    return {type: 'CHANGE_TODOLIST_FILTER', todoListId, value} as const
}

export const setTodoAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists: todolists} as const
}

export const disabledOneTodolistAC = (todoListId: string, status: RequestStatusType) => {
    return {type: 'TODO/DISABLED-ONE-TODOLIST', todoListId, status} as const
}

export const getTodoTC = (): AppThunk => {
    return (dispatch: Dispatch) => {   //тиризацию импортируем из Редакса
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTodolist()
            .then(res => {
                if (res.data) {
                    dispatch(setTodoAC(res.data))
                    dispatch(setAppStatusAC('sucssesed'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e: AxiosError) => {
                handleServerNetworkError(e, dispatch)
            })
    }
}

export const addTodoListTC = (title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {  //0 - это успех
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC('sucssesed'))
            } else {
                // if(res.data.messages[0]) {
                //     dispatch(setAppErrorAC(res.data.messages[0])) //выведи ошибку что пришлет сервер
                // } else {
                //     dispatch(setAppErrorAC('some error :('))  //если не прийдет смс, то выведи нашу ошибку
                // }
                // dispatch(setAppStatusAC('failed'))
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e: AxiosError) => {
            // dispatch(setAppStatusAC('failed'))
            // dispatch(setAppErrorAC(e.message))
            handleServerNetworkError(e, dispatch)
        })
}

export const removeTodoListTC = (todoListId: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(disabledOneTodolistAC(todoListId, 'loading'))
    todolistAPI.removeTodolist(todoListId)
        .then(res => {
            dispatch(removeTodoListAC(todoListId))
            dispatch(setAppStatusAC('sucssesed'))
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e, dispatch)
        })
}

export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(disabledOneTodolistAC(todolistId, 'loading'))
    todolistAPI.updateTodolist(todolistId, title)
        .then((res) => {
            dispatch(changeTodoListTitleAC(todolistId, title))
            dispatch(setAppStatusAC('sucssesed'))
            dispatch(disabledOneTodolistAC(todolistId, 'sucssesed'))
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e, dispatch)
        })
}