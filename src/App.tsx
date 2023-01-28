import React, {useEffect} from 'react';
import style from './App.module.scss'
import {useAppDispatch, useAppSelector} from './hooks/hooks';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from './components/Login';
import {TodolistMain} from './components/TodolistMain';
import {LoaderMain} from './components/LoaderMain';
import {Path} from './common/enums/Path';
import {PageNotFound} from './components/PageNotFound';
import {selectIsInitial, selectStatus} from './redux/selectors/selectorsApp';
import {initializeAppTC} from './redux/middlewares/thunkInitialize';
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const isInitialized = useAppSelector(selectIsInitial)
    const status = useAppSelector(selectStatus)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeAppTC()).then()
    }, [dispatch])

    if (!isInitialized) {
        return <LoaderMain/>
    }

    const ROUTES = [
        {path: Path.LOGIN, element: <Login/>},
        {path: Path.ERROR_404, element: <PageNotFound/>},
        {path: Path.HOME, element: <TodolistMain demo={demo}/>},
        {path: Path.OTHER, element: <Navigate to={Path.ERROR_404}/>},
    ]

    return (
        <>
            {status === 'loading' && <div style={{position: 'absolute', width: '100%', top: '155px', height: '2px'}}><LinearProgress color="primary"/></div>}

            <div className={style.wrapper}>
                <Header/>

                <Routes>
                    {ROUTES.map(({path, element}) => <Route key={path} path={path} element={element}/>)}
                </Routes>

                <Footer/>

            </div>

        </>
    );

}

export default App;

