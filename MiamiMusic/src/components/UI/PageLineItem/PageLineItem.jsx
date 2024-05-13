import React, { useState, useRef } from 'react';
import classes from './PageLineItem.module.css';
import img from '../../../img/luchick.jfif';
import imgPlay from '../../../svg/play_2.svg';
import imgStop from '../../../svg/pause_2.svg';
import luchik from '../../../mp3/Luchik.mp3'; // Путь к файлу музыки

const PageLineItem = ({ song, playSong }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleMouseOver = () => {
        setIsHovering(true);
    };
    
    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleButtonClick = () => {
        setIsButtonClicked(!isButtonClicked);
        if (!isButtonClicked) {
            playSong(song); 
        } else {
            playSong(null); 
        }
    };

    return (
        <div className={classes.albumItem__wrapper}>
            <div className={classes.albumItem} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                {isHovering 
                    ? <div className={classes.albumItem__imgWrapper}>
                        <img className={classes.albumItem__img} src={`http://localhost:5000${song.img}`} alt={song.title} />
                        <div className={classes.play__bg}>
                            <button className={classes.play} onClick={handleButtonClick}>
                                {isButtonClicked ? (
                                    <img className={classes.play__imgStop} src={imgStop} alt="Stop" />
                                ) : (
                                    <img className={classes.play__imgPlay} src={imgPlay} alt="Play" />
                                )}
                            </button>   
                        </div>
                    </div>
                    : <div className={classes.albumItem__imgWrapper}>
                        <img className={classes.albumItem__img} src={`http://localhost:5000${song.img}`} alt={song.title} />
                    </div>
                }
                <div className={classes.albumItem__bottom}>
                    <p className={classes.albumItem__title}>{song.title}</p>
                    <p className={classes.albumItem__artist}>{song.author}</p>
                    <p className={classes.albumItem__type}>сингл</p>
                </div>
                
            </div>
        </div>
    );
}

export default PageLineItem;
