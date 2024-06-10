import React, { useState, useContext } from 'react';
import Header from '../UI/header/header';
import Footer from '../UI/footer/footer';
import classes from './shareForm.module.css';
import { Context } from '../../main';

const ShareForm = ({ playSong }) => {
    const [playlistName, setPlaylistName] = useState('');
    const [friendEmail, setFriendEmail] = useState('');
    const [error, setError] = useState('');
    const { store } = useContext(Context);

    const handleShare = async () => {
        setError(''); // Сброс текущей ошибки перед попыткой отправки формы

        // Проверка, авторизован ли пользователь
        if (!store.isAuth) {
            setError('Вы должны быть авторизованы, чтобы поделиться плейлистом.');
            return;
        }

        if (!playlistName) {
            setError('Название плейлиста не должно быть пустым.');
            return;
        }

        if (!friendEmail) {
            setError('Электронная почта друга не должна быть пустой.');
            return;
        }

        try {
            // Проверка, существует ли пользователь с указанной электронной почтой
            const userResponse = await store.checkUser(friendEmail);
            if (!userResponse.exists) {
                setError('Пользователь с указанной электронной почтой не найден.');
                return;
            }

            // Проверка, существует ли плейлист с указанным названием
            const playlistResponse = await store.checkPlaylist(playlistName);
            if (!playlistResponse.exists) {
                setError('Плейлист с указанным названием не найден.');
                return;
            }

            // Логика для отправки данных
            console.log('Sharing playlist', playlistName, 'with', friendEmail);
            // Дополнительно: отправить данные на сервер для выполнения логики "поделиться плейлистом"

        } catch (error) {
            console.error('Ошибка при проверке данных:', error);
            setError('Произошла ошибка при проверке данных. Попробуйте еще раз.');
        }
    };

    return (
        <div className={classes.centerBlock}>
            <Header playSong={playSong} />
            <div className={classes.contentSpasing}>
                <div className={classes.form__main}>
                    <div className={classes.form__item}>
                        <label className={classes.form__label}>Название плейлиста</label>
                        <input
                            type="text"
                            className={classes.form__input}
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={classes.form__label}>Электронная почта друга:</label>
                        <input
                            type="text"
                            className={classes.form__input}
                            value={friendEmail}
                            onChange={(e) => setFriendEmail(e.target.value)}
                        />
                    </div>
                    {error && <div className={classes.error}>{error}</div>}
                    <button onClick={handleShare} className={classes.form__button}>Поделиться</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShareForm;
