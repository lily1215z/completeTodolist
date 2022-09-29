import React, {useEffect} from 'react';
import {v1} from "uuid";
import {TodoList} from "./components/TodoList";
import {UniversalInput} from "./components/UniversalInput";
import style from './App.module.css'
import tall from './image/tall2.png'
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
    const todoListId1 = v1();
    const todoListId2 = v1();
    const todoListId3 = v1();

    // const [todolist, setTodoList] = useState<Array<TodoListType>>([
    //     {id: todoListId1, title: 'Daily affairs', filter: 'all'},
    //     {id: todoListId2, title: 'My deals on camp', filter: 'all'},
    //     {id: todoListId3, title: 'What to take to camp', filter: 'all'}
    // ])

    //  const [tasks, setTasks] = useState<TasksType>({
    //         [todoListId1]: [
    //             {id: v1(), title: 'wash up', isDone: false},
    //             {id: v1(), title: 'brush your teeth', isDone: true},
    //             {id: v1(), title: 'make the bed', isDone: false},
    //             {id: v1(), title: 'read a book', isDone: false},
    //             {id: v1(), title: 'take vitamins', isDone: false},
    //             {id: v1(), title: 'draw', isDone: true},
    //             {id: v1(), title: 'help mom', isDone: false},
    //             {id: v1(), title: 'put away toys', isDone: false}
    //         ],
    //         [todoListId2]: [
    //             {id: v1(), title: 'to plant a tree', isDone: false},
    //             {id: v1(), title: 'fall in love', isDone: true},
    //             {id: v1(), title: 'save the raccoon', isDone: false},
    //             {id: v1(), title: 'spend the night in the forest', isDone: false}
    //         ],
    //         [todoListId3]: [
    //             {id: v1(), title: 'backpack', isDone: false},
    //             {id: v1(), title: 'food', isDone: false},
    //             {id: v1(), title: 'things', isDone: true},
    //             {id: v1(), title: 'myself', isDone: false},
    //         ]
    //     }
    // )
    const tasks = useSelector<AppRootState, TasksType>(state => state.tasks)
    const todolist = useSelector<AppRootState, Array<TodoListType>>(state => state.todolists)

    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();

    const removeTask = function (todolistId: string, taskId:string) {
        dispatch(removeTasksTC( todolistId, taskId));
    };

    const addTask = (todoListId: string, title: string) => {
      dispatch(addTasksTC(todoListId, title))
    }

    const changeFilter = (todoListId: string, value: TodoListFilterType) => {
        dispatch(changeFilterAC(todoListId, value))
    }

    const changeStatusTask = (todoListId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todoListId, taskId, {status: status}))
    }

    const removeTodoList = (todoListId: string) => {
        dispatch(removeTodoListTC(todoListId));
    }

    const addTodoList = (title: string) => {
        dispatch(addTodoListTC(title))
    }

    const changeTodoListTitle = ( todoListId: string, title: string) => {
        dispatch(changeTodolistTitleTC(todoListId, title))
    }

    const changeTaskTitle = ( todoListId: string, taskId: string, newTitle: string) => {
        dispatch(updateTaskTC(todoListId, taskId, {title: newTitle}))
    }

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
