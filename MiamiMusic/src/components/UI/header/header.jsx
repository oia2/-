import React, { useContext, useEffect } from 'react';
import classes from './header.module.css'
import MyInput from '../input/MyInput';
import { Link } from 'react-router-dom';
import { Context } from '../../../main';
import {observer} from "mobx-react-lite";

const Header = () => {
    const {store} = useContext(Context);


    if (!store.isAuth) {
        return(
        <div className={classes.header}>
            <MyInput />
            
            <div className={classes.authentication}>
                <Link to="/registration" className={classes.registration}>Зарегистрироваться</Link>
                <Link to="/login" className={classes.authorization} >Войти</Link>
            </div>
        </div>     
        )   
    }
    return (
        <div className={classes.header}>
            <MyInput />
            <button onClick={() => store.logout()} className={classes.logout}>Выйти</button>
            
        </div>
    );
}

export default observer(Header);
