import React, {useCallback, useEffect} from 'react';
import style from '../App.module.scss';
import {UniversalInput} from './UniversalInput';
import {TodoList} from './TodoList';
import {ErrorSnackbar} from './ЕrrorSnackbar';
import {
    addTodoListTC,
    changeFilterAC,
    changeTodolistTitleTC, getTodoTC,
    removeTodoListTC,
} from '../reducer/todolistReducer';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {addTasksTC, removeTasksTC, updateTaskTC} from '../reducer/tasksReducer';
import {Navigate} from 'react-router-dom';
import {Path} from '../common/enums/Path';
import {TaskStatuses, TodoListFilterType} from '../common/types/Types';
import {selectIsLoggedIn} from '../redux/selectors/selectorsAuth';
import {selectTasks} from '../redux/selectors/selectorsTasks';
import {selectTodolists} from '../redux/selectors/selectorsTodolist';


export const TodolistMain = ({demo = false}) => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const tasks = useAppSelector(selectTasks)
    const todolist = useAppSelector(selectTodolists)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getTodoTC())
    }, [])

    const removeTask = useCallback(function (todolistId: string, taskId: string) {
        dispatch(removeTasksTC(todolistId, taskId));
    }, [dispatch])

    const addTask = useCallback((todoListId: string, title: string) => {
        dispatch(addTasksTC(todoListId, title))
    }, [dispatch])

    const changeFilter = useCallback((todoListId: string, value: TodoListFilterType) => {
        dispatch(changeFilterAC(todoListId, value))
    }, [dispatch])

    const changeStatusTask = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todoListId, taskId, {status: status}))
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId));
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    }, [dispatch])

    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch(changeTodolistTitleTC(todoListId, title))
    }, [dispatch])

    const changeTaskTitle = useCallback((todoListId: string, taskId: string, newTitle: string) => {
        dispatch(updateTaskTC(todoListId, taskId, {title: newTitle}))
    }, [dispatch])

    if(!isLoggedIn) {
        // return <Navigate to={'/login'} />
        return <Navigate to={Path.LOGIN}/>
    }

    return (
        <main className={style.main}>
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

                            if (i.filter === 'active') {
                                tasksForTodoList = allTasksTodoLists.filter(i => i.status === 0)
                            }
                            if (i.filter === 'completed') {
                                tasksForTodoList = allTasksTodoLists.filter(i => i.status === 2)
                            }
                            return <TodoList
                                key={i.id}
                                todolist={i}
                                tasks={tasksForTodoList}
                                removeTask={removeTask}
                                addTask={addTask}
                                changeFilter={changeFilter}
                                changeStatusTask={changeStatusTask}
                                removeTodoList={removeTodoList}
                                changeTodoListTitle={changeTodoListTitle}
                                changeTaskTitle={changeTaskTitle}
                                demo={demo}
                            />
                        })
                    }
                </div>

                <ErrorSnackbar/>

            </div>
        </main>
    );
};

