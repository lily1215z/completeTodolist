import React, {useEffect} from 'react';
import {TaskStatuses, TaskType, TodoListFilterType} from "../App";
import {Task} from "./Task";
import {UniversalInput} from "./UniversalInput";
import style from '../App.module.css'
import {EditableItem} from "./EditableItem";
import {getTodoTC} from "../reducer/todolistReducer";
import {useAppDispatch} from "../hooks";
import {fetchTasksTC} from "../reducer/tasksReducer";

type TodoListPropsType = {
    todoListId: string
    tasks: Array<TaskType>
    todoListTitle: string
    removeTask: (taskId: string, todoListId: string) => void
    addTask: (todoListId: string, title: string) => void
    changeFilter: (todoListId: string, filter: TodoListFilterType) => void
    changeStatusTask: (todoListId: string, taskId: string, status: TaskStatuses) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    changeTaskTitle: (title: string, todoListId: string, taskId: string) => void
}

export const TodoList: React.FC<TodoListPropsType> = ({
                                                          tasks,
                                                          todoListTitle,
                                                          todoListId,
                                                          removeTask,
                                                          addTask,
                                                          changeFilter,
                                                          changeStatusTask,
                                                          removeTodoList,
                                                          changeTodoListTitle,
                                                          changeTaskTitle
                                                      }) => {

    const dispatch = useAppDispatch();
    const addTaskValue = (title: string) => {
        addTask(todoListId, title)
    }

    const onClickFilter = (filter: TodoListFilterType) => {
        changeFilter(todoListId, filter)
    }
    const changeTodoListTitleHandler = (newTitle: string) => {
        changeTodoListTitle(todoListId, newTitle)
    }

    const styleForTodolistTitle = {
        fontFamily: "'Ruslan Display', cursive",
        margin: 0,
        fontSize: '24px'
    }

    useEffect(() => {
        dispatch(fetchTasksTC(todoListId))
    }, [])

    return (
        <div className={style.card}>
            <EditableItem
                addItem={changeTodoListTitleHandler}
                titleInState={todoListTitle}
                styleTitle={styleForTodolistTitle}
            />
            {/*<h2 className={style.title_todolist}>{todoListTitle}</h2>*/}

            <button className={style.btn_close} onClick={() => removeTodoList(todoListId)}>x</button>
            <div className={style.card_inputbox}>
                <UniversalInput
                    placeholder={'write your case'}
                    addItem={addTaskValue}
                />
            </div>

            <ul className={style.card_map}>
                {
                    tasks.map(i => {
                        const changeTaskTitleHandler = (newValue: string) => {
                            changeTaskTitle(todoListId, i.id, newValue)
                        }

                        return <Task
                            key={i.id}
                            todoListId={todoListId}
                            removeTask={removeTask}
                            changeStatusTask={changeStatusTask}
                            taskId={i.id}
                            check={i.status}
                            title={i.title}
                            changeTaskTitle={changeTaskTitleHandler}
                        />
                    })

                }
            </ul>
            <div className={style.btn_box}>
                <button className={style.btn_todolist} onClick={() => onClickFilter('all')}>All</button>
                <button className={style.btn_todolist} onClick={() => onClickFilter('active')}>Active</button>
                <button className={style.btn_todolist} onClick={() => onClickFilter('completed')}>Completed</button>
            </div>
        </div>
    );
};

