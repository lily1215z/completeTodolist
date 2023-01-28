import {RequestStatusType, TodoListFilterType, TodolistType} from '../../common/types/Types';

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

export type TodolistActionsType = ReturnType<typeof removeTodoListAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof setTodoAC>
    | ReturnType<typeof disabledOneTodolistAC>