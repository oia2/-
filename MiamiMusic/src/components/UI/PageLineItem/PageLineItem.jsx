import {React, useState} from 'react';
import classes from './PageLineItem.module.css'
import img from '../../../img/luchick.jfif'
import imgPlay from '../../../svg/play_2.svg'
import imgStop from '../../../svg/pause_2.svg'


const PageLineItem = () => {
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
        <div className={classes.albumItem} 
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
        {isHovering 
            ?   <div className={classes.albumItem__imgWrapper}>
                    <img className={classes.albumItem__img} src={img} alt="" />
                    <div className={classes.play__bg}>
                        <button className={classes.play} onClick={handleButtonClick}>
                        {isButtonClicked ? (
                                    <img className={classes.play__imgStop} src={imgStop} alt="" />
                                ) : (
                                    <img className={classes.play__imgPlay} src={imgPlay} alt="" />
                                )}
                        </button>
                    </div>
                </div>
            :   <div className={classes.albumItem__imgWrapper}>
                    <img className={classes.albumItem__img} src={img} alt="" />
                </div>
        }
            
            <div className={classes.albumItem__bottom}>
                <p className={classes.albumItem__title}>Лучик (Prod. by Choppa808)</p>
                <p className={classes.albumItem__artist}>TWINKY</p>
                <p className={classes.albumItem__type}>сингл</p>
            </div>
        </div>
    );
}

export default PageLineItem;
