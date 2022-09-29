import {TaskPriorities, TaskStatuses, TasksType, TaskType} from "../App";
import {addTodoListAC, removeTodoListAC, setTodoAC} from "./todolistReducer";
import {Dispatch} from "redux";
import {todolistAPI, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootState, AppThunk} from "../redux/store";

const initState: TasksType = {}

export type UpdateTaskActionType = {
    type: 'UPDATE-TASK', //заменила имя на общее название
    todolistId: string
    taskId: string
    // status: TaskStatuses  //одно св-во заменили на общий обьект
    model: UpdateDomainTaskModelType
}
export type TasksActionsType = ReturnType<typeof removeTasksAC>
    | ReturnType<typeof addTasksAC>
    // | ReturnType<typeof changeStatusTaskAC>
    // | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof removeTodoListAC>
    // | ReturnType<typeof setTasksAC>
    | SetTasksActionType
    | ReturnType<typeof setTodoAC>
    | ReturnType<typeof updateTaskAC>

export const tasksReducer = (state: TasksType = initState, action: TasksActionsType): TasksType => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = stateCopy[action.todolistId].filter(i => i.id !== action.taskId)
            return stateCopy

            // const stateCopy = {...state}
            // const tasks = stateCopy[action.todolistId];
            // const newTasks = tasks.filter(t => t.id != action.taskId);
            // stateCopy[action.todolistId] = newTasks;
            // return stateCopy;

        }
        case 'ADD_TASK': {
            // const newTask = {id: v1(), title: action.title, isDone: false}
            // return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}

            // const stateCopy = {...state}
            // const newTask: TaskType = {id: v1(), title: action.title, isDone: false}
            // const tasks = stateCopy[action.todolistId];
            // const newTasks = [newTask, ...tasks];
            // stateCopy[action.todolistId] = newTasks;
            // return stateCopy;

            return {
                ...state,
                [action.todolistId]: [action.task, ...state[action.todolistId]]
            }
        }
        // case 'CHANGE_STATUS_TASK': {
        //     // state[action.todoListId].map(i => {
        //     //      if (i.id === action.taskId) {
        //     //          i.isDone = action.isDone
        //     //      }
        //     //  })
        //     //  return  {...state}
        //     let todolistTasks = state[action.todoListId];
        //     state[action.todoListId] = todolistTasks
        //         .map(t => t.id === action.taskId
        //             ? {...t, isDone: action.isDone}
        //             : t);
        //     return ({...state});
        // }
        // case 'CHANGE_TASK_TITLE': {
        //     // let todolistTasks = state[action.todoListId];
        //     // let task = todolistTasks.find(t => t.id === action.taskId);
        //     // if (task) {
        //     //     task.title = action.title;
        //     // }
        //     // return {...state}
        //     // // return ({...state});  ??????? why ()
        //
        //     let todolistTasks = state[action.todoListId];
        //     state[action.todoListId] = todolistTasks.map(t => t.id === action.taskId
        //         ? {...t, title: action.title}
        //         : t);
        //     return ({...state});
        //
        // }
        case 'ADD_TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE_TODOLIST': {
            const copyState = {...state};
            delete copyState[action.todoListId];
            return copyState;
        }
        case 'UPDATE-TASK': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                //берем таску целиком, и потом разкукоживаем модельку в кот какие-т осв-ва надо заменить
                .map(t => t.id === action.taskId ? {...t, ...action.model} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            //в каждом тодолисте создаем ключ и к нему присваиваем пустой массив где будут таски
            action.todolists.forEach(i => stateCopy[i.id] = [])
            return stateCopy
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
};

export const removeTasksAC = (todolistId: string, taskId: string) => {
    return {type: 'REMOVE_TASK', todolistId, taskId} as const
}

export const addTasksAC = (todolistId: string, task: TaskType) => {
    return {type: 'ADD_TASK', todolistId, task} as const
}
// export const changeStatusTaskAC = (todoListId: string, taskId: string, isDone: boolean) => {
//     return {type: 'CHANGE_STATUS_TASK', todoListId, taskId, isDone} as const
// }
//
// export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string) => {
//     return {type: 'CHANGE_TASK_TITLE', todoListId, taskId, title} as const
// }
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): UpdateTaskActionType => {
    return {type: 'UPDATE-TASK', model, todolistId, taskId}
}

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
            })
    }
}

export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => (dispatch: Dispatch) => {
    todolistAPI.removeTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTasksAC(todolistId, taskId))
        })
}

export const addTasksTC = (todolistId: string, title: string): AppThunk => (dispatch: Dispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTasksAC(todolistId, res.data.data.item))
        })
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootState) => {
        const state = getState()
        const task = state.tasks[todolistId].find(i => i.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {   //это то что отправляем. и типы разные
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status,
            //то что прийдет с UA его и перезатри а остальные оставим как есть
            ...domainModel
        }
        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(() => {
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
            })
    }
}
