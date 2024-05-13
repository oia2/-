import {React, useContext} from 'react';
import classes from './PageLineNew.module.css'
import img from '../../img/luchick.jfif'
import PageLineItem from '../UI/PageLineItem/PageLineItem';
import { MusicContext } from '../../../MusicContext/MusicContext';

const PageLineNew = ({playSong, ...props}) => {
    const { music, setMusic } = useContext(MusicContext);

    return (
        <div className={classes.pageLine}>
            <div className={classes.pageLine__subtitleWrapper}>
                <span className={classes.pageLine__subtitle}>{props.subtitle}</span>
                <div className={classes.pageLine__discription}>
                    <span className={classes.pageLine__discriptionText}>{props.discriptionText}</span>
                </div>
            </div>
            <div className={classes.pageLine__albums}>
                {music.map(song => (
                    <PageLineItem key={song.title} song={song} playSong={playSong} />
                ))}
            </div>
        </div>
    );
}

export default PageLineNew;
