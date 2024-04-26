import React, { useContext, useState } from 'react';
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom'; // Импорт хука useNavigate
import { Context } from '../../main';
import classes from './registration.module.css';
import protection from '../../svg/protection.svg';
import { Link } from 'react-router-dom';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { store } = useContext(Context);
    const navigate = useNavigate(); // Инициализация useNavigate

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (password) => {
        return password.length >= 3 && password.length <= 32;
    };

    const handleRegistration = async () => {
        setError(''); // Сброс текущей ошибки перед попыткой регистрации
        if (!validateEmail(email)) {
            setError('Введите корректный email.');
            return;
        }
        if (!validatePassword(password)) {
            setError('Пароль должен быть от 3 до 32 символов.');
            return;
        }
        const serverError = await store.registration(email, password);
        if (serverError) {
            setError(serverError);
        } else {
            navigate('*', { replace: true }); // Перенаправление на главную страницу после успешной регистрации
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
                    <p className={classes.form__shild}>
                        Регистрация в MiamiMusic
                    </p>
                </div>
                <div className={classes.form__main}>
                    <div className={classes.form__item}>
                        <label className={classes.form__label}>Электронная почта:</label>
                        <input onChange={e => setEmail(e.target.value)}
                               value={email}
                               type="text" 
                               className={classes.form__input}/>
                    </div>
                    <div>
                        <label className={classes.form__label}>Пароль:</label>
                        <input onChange={e => setPassword(e.target.value)}
                               value={password}
                               type="password"
                               className={classes.form__input}/>
                    </div>
                    {error && <div className={classes.error}>{error}</div>}
                    <button onClick={handleRegistration} className={classes.form__button}>Регистрация</button>
                </div>
                <div className={classes.form__footerWrapper}>
                    <div className={classes.form__footer}>
                        <p className={classes.form__footerText}>Уже есть аккаунт? <Link to="/login">Войдите в него</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(Registration);
