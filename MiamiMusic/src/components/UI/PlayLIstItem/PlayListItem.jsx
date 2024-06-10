import React, { useState } from 'react';
import classes from './PlayListItem.module.css';
import imgPlay from '../../../svg/play_2.svg';
import imgStop from '../../../svg/pause_2.svg';
import heart from '../../../img/i.webp';
import note from '../../../img/note.png';

const PlayListItem = ({ title, onClick, imageUrl }) => {
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
    };

    return (
        <div className={classes.albumItem__wrapper} onClick={onClick}>
            <div className={classes.albumItem} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                {isHovering 
                    ? <div className={classes.albumItem__imgWrapper}>
                        <img className={classes.albumItem__img} src={title === "Мне нравится" ? heart : (imageUrl || note)} />
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
                        <img className={classes.albumItem__img} src={title === "Мне нравится" ? heart : (imageUrl || note)} />
                    </div>
                }
                <div className={classes.albumItem__bottom}>
                    <p className={classes.albumItem__title}>{title}</p>
                </div>
            </div>
        </div>
    );
};

export default PlayListItem;
