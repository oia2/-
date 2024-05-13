import {React, useState} from 'react';
import classes from './SearchItem.module.css';
import imgPlay from '../../../svg/play_2.svg';
import imgStop from '../../../svg/pause_2.svg';

const SearchItem = ({song, playSong}) => {
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
        
        <div className={classes.title} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {isHovering 
                ? <div className={classes.title__imgWrapper}>
                      <img className={classes.title__img} src={`http://localhost:5000${song.img}`} alt={song.title} />
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
                :  
                <div className={classes.title__imgWrapper}>
                    <img src={`http://localhost:5000${song.img}`} alt="" className={classes.title__img}/>
                </div>
            }
            <div className={classes.title__text}>
                <p className={classes.trackTitle}>{song.title}</p>
                <p className={classes.author}>{song.author}</p>
            </div>
      </div>
    );
}

export default SearchItem;
