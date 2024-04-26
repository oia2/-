import React, { useContext, useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import classes from './login.module.css';
import protection from '../../svg/protection.svg';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isAuth) {
            navigate('*', { replace: true });
        }
    }, [store.isAuth, navigate]);

    const handleLogin = async () => {
        setError(''); // Сброс текущей ошибки перед попыткой входа
        const error = await store.login(email, password);
        if (error) {
            setError(error);
        }
    };
    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <Link to="*" className={classes.header__logo}>MiamiMusic</Link>
            </div>
            <div className={classes.form}>
                <div className={classes.form__top}>
                    <img src={protection} alt="" />
                    <p class={classes.form__shild}>
                        Войти в MiamiMusic
                    </p>
                </div>
                <div className={classes.form__main}>
               
                    <div className={classes.form__item}>
                        <label
                         class={classes.form__label}>Электронная почта:</label>
                        <input  onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="text" 
                         class={classes.form__input}/>
                    </div>
                    <div>
                        <label class={classes.form__label}>Пароль:</label>
                        <input 
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        class={classes.form__input}/>
                    </div>
                    {error && <div className={classes.error}>{error}</div>}
                    <button onClick={handleLogin} className={classes.form__button}>Вход</button>
                </div>
                <div className={classes.form__footerWrapper}>
                    <div className={classes.form__footer}>
                        <p className={classes.form__footerText}>Нет аккаунта? <Link to="/registration">Регистрация в MiamiMusic</Link></p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default observer(Login);
