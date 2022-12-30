import axios, {AxiosResponse} from 'axios'
import {Path} from '../common/enums/Path';
import {LoginParamsType, TaskType, TodolistType, UpdateTaskModelType, ResponseType} from '../common/types/Types';

const instance = axios.create({
    // baseURL: process.env.REACT_APP_BASE_URL,
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '7d5807d9-4ee9-47bf-981f-fcc2c567bea3'
    }
})

export const todolistAPI = {
    getTodolist() {
        return instance.get<Array<TodolistType>>(Path.TODOLIST)
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>(Path.TODOLIST, {title});
    },
    removeTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`${Path.TODOLIST}/${todolistId}`)
    },
    updateTodolist(id: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`${Path.TODOLIST}/${id}`, {title});
    },

    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`${Path.TODOLIST}/${todolistId}/${Path.TASKS}`)
    },
    removeTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${Path.TODOLIST}/${todolistId}/${Path.TASKS}/${taskId}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`${Path.TODOLIST}/${todolistId}/${Path.TASKS}`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`${Path.TODOLIST}/${todolistId}/${Path.TASKS}/${taskId}`, model);
    }
}

export const authAPI = {
    login(dataLoginForm: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId?: number }>>>(Path.AUTH_LOGIN, dataLoginForm)
    },
    me() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>(Path.AUTH_ME)
    },
    logout() {
        return instance.delete<ResponseType>(Path.AUTH_LOGIN)
    }
}

//type
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}


