import React, {useCallback, useEffect} from 'react';
import {TodoList} from "./components/TodoList";
import {UniversalInput} from "./components/UniversalInput";
import style from './App.module.css'
// import tall from './image/tall2.png'
import {useSelector} from "react-redux";
import {
    addTasksTC, removeTasksTC, updateTaskTC
} from "./reducer/tasksReducer";
import {AppRootState} from "./redux/store";
import {addTodoListTC,
    changeFilterAC, changeTodolistTitleTC,
    getTodoTC,removeTodoListTC
} from "./reducer/todolistReducer"

import {useAppDispatch} from "./hooks";

export type TodoListFilterType = 'all' | 'completed' | 'active';

export type TodoListType = {
    id: string,
    title: string,
    filter: TodoListFilterType
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    // id: string,
    // title: string,
    // isDone: boolean
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type TasksType = {
    [key: string]: Array<TaskType>
}

function App() {
    console.log('app')
    //const todoListId1 = v1();
    // const [todolist, setTodoList] = useState<Array<TodoListType>>([
    //     {id: todoListId1, title: 'Daily affairs', filter: 'all'},
    //     {id: todoListId2, title: 'My deals on camp', filter: 'all'},
    //     {id: todoListId3, title: 'What to take to camp', filter: 'all'}
    // ])

    //  const [tasks, setTasks] = useState<TasksType>({
    //         [todoListId1]: [
    //             {id: v1(), title: 'wash up', isDone: false},
    //             {id: v1(), title: 'brush your teeth', isDone: true}
    //         ]
    //     }
    // )
    const tasks = useSelector<AppRootState, TasksType>(state => state.tasks)
    const todolist = useSelector<AppRootState, Array<TodoListType>>(state => state.todolists)

    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();

    const removeTask = useCallback(function (todolistId: string, taskId:string) {
        dispatch(removeTasksTC( todolistId, taskId));
    }, [dispatch])

    const addTask = useCallback((todoListId: string, title: string) => {
      dispatch(addTasksTC(todoListId, title))
    }, [dispatch])

    const changeFilter = useCallback((todoListId: string, value: TodoListFilterType) => {
        dispatch(changeFilterAC(todoListId, value))
    },[dispatch])

    const changeStatusTask = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todoListId, taskId, {status: status}))
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId));
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    },[dispatch])

    const changeTodoListTitle = useCallback(( todoListId: string, title: string) => {
        dispatch(changeTodolistTitleTC(todoListId, title))
    },[dispatch])

    const changeTaskTitle = useCallback(( todoListId: string, taskId: string, newTitle: string) => {
        dispatch(updateTaskTC(todoListId, taskId, {title: newTitle}))
    },[dispatch])

    useEffect(() => {
        dispatch(getTodoTC())
    },[])

    return (
        <div className={style.wrapper}>
            <header className={style.header}>
                <h1 className={style.title}>My first things...</h1>
            </header>

            <main className={style.main}>
                {/*<div className={style.tall}>*/}
                {/*    <img width={480} src={tall} />*/}
                {/*</div>*/}
                <div className={style.plan}>
                    <div className={style.plan_add}>
                        <h2 className={style.plan_title}>My plans</h2>
                        <div className={style.plan_img}>
                            <UniversalInput
                                placeholder={'write the name of your list'}
                                addItem={addTodoList}
                            />
                        </div>

                    </div>
                    <div className={style.card_box}>
                        {
                            todolist.map(i => {
                                let allTasksTodoLists = tasks[i.id]

                                let tasksForTodoList = allTasksTodoLists

                                if (i.filter === "active") {
                                    tasksForTodoList = allTasksTodoLists.filter(i => i.status === 0)
                                }
                                if (i.filter === "completed") {
                                    tasksForTodoList = allTasksTodoLists.filter(i => i.status === 2)
                                }
                                return <TodoList
                                    key={i.id}
                                    todoListId={i.id}
                                    tasks={tasksForTodoList}
                                    todoListTitle={i.title}
                                    removeTask={removeTask}
                                    addTask={addTask}
                                    changeFilter={changeFilter}
                                    changeStatusTask={changeStatusTask}
                                    removeTodoList={removeTodoList}
                                    changeTodoListTitle={changeTodoListTitle}
                                    changeTaskTitle={changeTaskTitle}
                                />
                            })
                        }
                    </div>

                </div>

            </main>

            <footer className={style.footer}>
                Not Copyright 2022 • My first things... Webflow cloneable. All rights reserved
            </footer>
        </div>
    );
}

export default App;
