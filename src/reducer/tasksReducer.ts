import {TasksType} from '../common/types/Types';
import {TasksActionsType} from '../redux/actions/actionsTasks';

const initState: TasksType = {}

export const tasksReducer = (state: TasksType = initState, action: TasksActionsType): TasksType => {
    switch (action.type) {
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(i => i.id !== action.taskId)}

        case 'ADD_TASK':
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}

        case 'ADD_TODOLIST':
            return {...state, [action.todolist.id]: []}

        case 'REMOVE_TODOLIST':
            const copyState = {...state};
            delete copyState[action.todoListId];
            return copyState;

        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }

        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            //in every todolist create key and add empty array in this todolist where will be tasks
            action.todolists.forEach(i => stateCopy[i.id] = [])
            return stateCopy
        }

        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}

        default:
            return state
    }
};



