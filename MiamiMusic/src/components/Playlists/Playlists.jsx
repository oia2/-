import React from 'react';
import classes from './Playlists.module.css'
import musicSvg from '../../svg/music.svg'
import plusSvg from '../../svg/plus.svg'

const Playlists = () => {
    return (
        <div className={classes.playlists}>
            <div className={classes.head}>
                <div className={classes.head__text}> 
                    <img className={classes.head__img} src={musicSvg} alt="" />
                    <span className={classes.head__span}>
                        Моя коллекция
                    </span>
                </div>
                <a href='#'>
                    <img className={classes.plusImg} src={plusSvg} alt="" />
                </a>
            </div>
            <div className={classes.plugArea}>
                <div className={classes.plug}>
                    <span className={classes.plug__text}>Создай свой первый плейлист</span>
                    <span className={classes.plug__discription}>Это очень просто!</span>
                    <button  className={classes.plug__button}>Создать плейлист</button>
                </div>
            </div>
        </div>
    );
}

export default Playlists;
