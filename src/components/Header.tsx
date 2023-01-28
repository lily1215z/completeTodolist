import React from 'react';
import style from '../App.module.scss';
import {useAppDispatch, useAppSelector} from '../hooks/hooks';
import {selectIsInitial, selectLogin} from '../redux/selectors/selectorsApp';
import {logoutTC} from '../redux/middlewares/thunkAuth';

export const Header = () => {
    const isInitial = useAppSelector(selectIsInitial);
    const login = useAppSelector(selectLogin)

    const dispatch = useAppDispatch();

    const logout = () => {
        dispatch(logoutTC()).then()
    }

    return (
        <header className={style.header}>
            <h1 className={style.title}>My first things...</h1>
            <div className={style.login_box}>
                <span className={style.nik_name}>{isInitial ? login : 'hello'}</span>
                <span
                    className={style.logout}
                    onClick={logout}
                >LogOut</span>
            </div>
        </header>
    );
};

