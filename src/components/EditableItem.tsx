import React, {useState} from 'react';
import style from "../App.module.scss";
import {KeyboardEvent} from 'react';

type todoListTitleType = {
    titleInState: string
    addItem: (newTitle: string) => void
    styleTitle: any
}

export const EditableItem: React.FC<todoListTitleType> =  React.memo(({ titleInState, addItem, styleTitle}) => {

    const [edit, setEdit] = useState(false)
    const [value, setValue] = useState(titleInState);

    const activateViewMode = () => {
        setEdit(false)
        addItem(value)
    }

    const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode  === 13) {
            setEdit(false)
            addItem(value)
        }
    }

    return (
        <>
            {
                edit
                    ?
                    <input
                        value={value}
                        onChange={(e) => setValue(e.currentTarget.value)}
                        onBlur={activateViewMode}
                        className={style.input_edit}
                        onKeyPress={onPressEnter}
                        autoFocus
                    />
                    : <span style={styleTitle} onDoubleClick={() => setEdit(true)}>{titleInState}</span>
            }
        </>
    );
});
