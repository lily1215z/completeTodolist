import { TodolistDomainType} from '../common/types/Types';
import {TodolistActionsType} from '../redux/actions/actionTodolists';

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





