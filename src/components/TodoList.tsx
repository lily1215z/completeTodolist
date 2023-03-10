import React, {useCallback} from 'react';
import {Task} from './Task';
import {UniversalInput} from './UniversalInput';
import style from '../App.module.scss'
import {EditableItem} from './EditableItem';
import {TaskStatuses, TaskType, TodolistDomainType, TodoListFilterType} from '../common/types/Types';

type TodoListPropsType = {
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string) => void
    addTask: (todoListId: string, title: string) => void
    changeFilter: (todoListId: string, filter: TodoListFilterType) => void
    changeStatusTask: (todoListId: string, taskId: string, status: TaskStatuses) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    changeTaskTitle: (title: string, todoListId: string, taskId: string) => void
    todolist: TodolistDomainType
    demo?: boolean
}

export const TodoList: React.FC<TodoListPropsType> = React.memo(({
                                                                     demo = false,
                                                                     tasks,
                                                                     todolist,
                                                                     removeTask,
                                                                     addTask,
                                                                     changeFilter,
                                                                     changeStatusTask,
                                                                     removeTodoList,
                                                                     changeTodoListTitle,
                                                                     changeTaskTitle
                                                                 }) => {

    const addTaskValue = useCallback((title: string) => {
        addTask(todolist.id, title)
    }, [todolist.id, addTask])

    const onClickFilter = useCallback((filter: TodoListFilterType) => {
        changeFilter(todolist.id, filter)
    }, [todolist.id, changeFilter])

    const changeTodoListTitleHandler = useCallback((newTitle: string) => {
        changeTodoListTitle(todolist.id, newTitle)
    }, [todolist.id, changeTodoListTitle])

    const styleForTodolistTitle = {
        fontFamily: '\'Ruslan Display\', cursive',
        margin: 0,
        fontSize: '24px',
        overflow: 'hidden',
        overflowWrap: 'break-word',
    }
    //
    // useEffect(() => {
    //         // if (demo) {
    //         //     return
    //         // }
    //     dispatch(fetchTasksTC(todolist.id))
    // }, [])

    return (
        <div className={style.card}>
            <EditableItem
                addItem={changeTodoListTitleHandler}
                titleInState={todolist.title}
                styleTitle={styleForTodolistTitle}
            />

            <button className={style.btn_close} disabled={todolist.entityStatus === 'loading'} onClick={() => removeTodoList(todolist.id)}>x</button>
            <div className={style.card_inputbox}>
                <UniversalInput
                    entityStatus={todolist.entityStatus}
                    placeholder={'write your case'}
                    addItem={addTaskValue}
                />
            </div>

            <ul className={style.card_map}>
                {
                    tasks.map(task => {
                        const changeTaskTitleHandler = (newValue: string) => {
                            changeTaskTitle(todolist.id, task.id, newValue)
                        }

                        return <Task
                            key={task.id}
                            todoListId={todolist.id}
                            removeTask={removeTask}
                            changeStatusTask={changeStatusTask}
                            taskId={task.id}
                            check={task.status}
                            title={task.title}
                            changeTaskTitle={changeTaskTitleHandler}
                            entityStatus={todolist.entityStatus}
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
});

