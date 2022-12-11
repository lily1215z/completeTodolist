import React from 'react';
import style from '../App.module.css';

export const Header = () => {
    return (
        <header className={style.header}>
            <h1 className={style.title}>My first things...</h1>
            <div className={style.login_box}>
                <span className={style.nik_name}>lily1215</span>
                <span className={style.logout}>LogOut</span>
            </div>
        </header>
    );
};

