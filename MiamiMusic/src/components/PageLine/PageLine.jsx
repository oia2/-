import React, { useEffect, useState, useContext } from 'react';
import classes from './PageLine.module.css';
import PageLineItem from '../UI/PageLineItem/PageLineItem';
import { Link } from 'react-router-dom';
import MusicService from '../../services/MusicService';
import { MusicContext } from '../../../MusicContext/MusicContext';

const PageLine = ({ playSong, ...props }) => {
    const { music, setMusic } = useContext(MusicContext);
    
    return (
        <div className={classes.pageLine}>
            <div className={classes.pageLine__subtitleWrapper}>
                <span className={classes.pageLine__subtitle}>{props.subtitle}</span>
                <div className={classes.pageLine__discription}>
                    <span className={classes.pageLine__discriptionText}>{props.discriptionText}</span>
                    <Link to="/new" className={classes.pageLine__showAll}>Показать все</Link>
                </div>
            </div>
            <div className={classes.pageLine__albums}>
                {music.map(song => (
                    <PageLineItem key={song.title} song={song} playSong={playSong} />
                ))}
            </div>
        </div>
    );
};

export default PageLine;
