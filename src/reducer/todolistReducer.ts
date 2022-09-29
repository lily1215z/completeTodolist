import {TodoListFilterType} from "../App";
import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppThunk} from "../redux/store";

const initState: Array<TodolistDomainType> = []

export type TodolistActionsType = ReturnType<typeof removeTodoListAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodoAC>

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
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
            return [{...action.todolist, filter: 'all'}, ...state]
        }

        case 'CHANGE_TODOLIST_FILTER': {
            let todolistV = state.find(i => i.id === action.todoListId);
            if (todolistV) {
                todolistV.filter = action.value
            }
            return [...state]
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map(i => ({...i, filter: 'all'}))
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
    return {type: "SET-TODOLISTS", todolists: todolists} as const
}

export const getTodoTC = (): AppThunk => {
    return (dispatch: Dispatch) => {   //тиризацию импортируем из Редакса
        todolistAPI.getTodolist()
            .then(res => {
                dispatch(setTodoAC(res.data))
            })
    }
}

export const addTodoListTC = (title: string): AppThunk => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
        .then(res => {
            dispatch(addTodoListAC(res.data.data.item))
        })
}

export const removeTodoListTC = (todoListId: string): AppThunk => (dispatch: Dispatch) => {
    todolistAPI.removeTodolist(todoListId)
        .then(res => {
            dispatch(removeTodoListAC(todoListId))
        })
}

export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then((res) => {
            dispatch(changeTodoListTitleAC(todolistId, title))
        })
}