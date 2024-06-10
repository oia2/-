import React, { useRef, useState, useEffect } from 'react';
import classes from './player.module.css';
import back from '../../svg/back.svg';
import next from '../../svg/next.svg';
import playPlayer from '../../svg/playPlayer.svg';
import pausePl from '../../svg/pausePl.svg';
import sound from '../../svg/sound.svg';
import repeatW from '../../svg/repeatW.svg';
import shuffleW from '../../svg/shuffleW.svg';
import heart from '../../svg/heart.svg';
import plus16 from '../../svg/plus16.svg';


const Player = ({audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs})=> {
  if (!currentSong) {
    return <div>Loading song data...</div>;
}
  const [volume, setVolume] = useState(0.5); // Громкость инициализируется на 50%
  const [isDragging, setIsDragging] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playedIndices, setPlayedIndices] = useState([]);

  const clickRef = useRef();
  const volumeRef = useRef();

  const PlayPause = ()=>
  {
    setisplaying(!isplaying);
  }

 const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    setPlayedIndices([]); // Сброс при переключении режима shuffle
  };
  

  const checkWidth = (e)=>
  {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = offset / width * 100;
    audioElem.current.currentTime = divprogress / 100 * currentSong.length;

  }

 const skipBack = () => {
  const index = songs.findIndex(x => x.title === currentSong.title);
  let newSong = {};

  if (index === 0) {
    newSong = { ...songs[songs.length - 1], progress: 0 };
  } else {
    newSong = { ...songs[index - 1], progress: 0 };
  }
  
  setCurrentSong(newSong);
  audioElem.current.currentTime = 0;
};

const skiptoNext = () => {
  let newSong;
  if (isShuffle) {
    newSong = getRandomSong(currentSong);
  } else {
    const index = songs.findIndex(x => x.title === currentSong.title);
    if (index === songs.length - 1) {
      newSong = { ...songs[0], progress: 0 };
    } else {
      newSong = { ...songs[index + 1], progress: 0 };
    }
  }
  setCurrentSong(newSong);
  audioElem.current.currentTime = 0;
  if (isplaying) audioElem.current.play();
};


const handleMouseDown = (type) => {
  setIsDragging(true);
};

const handleMouseMove = (e, type) => {
  if (!isDragging) return;
  const width = volumeRef.current.clientWidth;
  const offset = e.nativeEvent.offsetX;
  const newVolume = offset / width;
  audioElem.current.volume = newVolume;
  setVolume(newVolume);

};

const handleMouseUp = () => {
  setIsDragging(false);
};

useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
        if (isDragging) {
            handleMouseMove(e, 'volume');
        }
    };

    const handleMouseUpGlobal = () => {
        setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMoveGlobal);
    document.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
}, [isDragging]);


useEffect(() => {
  const onAudioEnd = () => {
    if (isRepeat) {
      audioElem.current.currentTime = 0;
      audioElem.current.play();
    } else {
      skiptoNext();
    }
  };

  const audioEl = audioElem.current;
  audioEl.addEventListener('ended', onAudioEnd);

  return () => {
    audioEl.removeEventListener('ended', onAudioEnd);
  };
}, [isRepeat, currentSong, songs, isplaying]);

const getRandomSong = (currentSong) => {
  let availableSongs = songs.filter((_, index) => !playedIndices.includes(index));
  if (availableSongs.length === 0) {
    setPlayedIndices([]);
    availableSongs = songs;
  }

  const randomIndex = Math.floor(Math.random() * availableSongs.length);
  const newSongIndex = songs.findIndex(song => song.title === availableSongs[randomIndex].title);

  // Обновляем список воспроизведенных треков
  setPlayedIndices(prevIndices => [...prevIndices, newSongIndex]);
  return songs[newSongIndex];
};

  return (
    <div className={classes.player__container}>
      <div className={classes.title}>
        <img src={`http://localhost:5000${currentSong.img}`} alt="" className={classes.title__img}/>
        <div className={classes.title__text}>
          <p className={classes.trackTitle}>{currentSong.title}</p>
          <p>{currentSong.author}</p>
        </div>
      </div>
      <div className={classes.navigator}>
        <div className={classes.controls}>
          <div className={classes.playlistControls}>
            <img className={classes.heart} src={heart} alt="" />
            <img className={classes.plus16  } src={plus16} alt="" />
          </div>
          <div className={classes.controls__center}>
          <img src={shuffleW} className={`${classes.btn__shuffle} ${isShuffle ? classes.shuffleActive : classes.shuffleInactive}`} onClick={toggleShuffle} />
            <img src={back} className={classes.btn__back} onClick={skipBack} />
            <div className={classes.btn__act}>
              {isplaying ? (
              <img src={pausePl} className={classes.btn__pause} onClick={PlayPause} />
              ) : (
              <img src={playPlayer} className={classes.btn__play} onClick={PlayPause} />
              )}
            </div>
            <img src={next} className={classes.btn__next} onClick={skiptoNext} />
            <img src={repeatW} className={`${classes.btn__repeat} ${isRepeat ? classes.repeatActive : classes.repeatInactive}`} onClick={toggleRepeat} />
          </div>
            <div className={classes.volume}>
              <img className={classes.volume__img} src={sound} alt="" />
            <div
              className={classes.volume__wrapper}
              onMouseDown={() => handleMouseDown('volume')}
              onMouseMove={(e) => handleMouseMove(e, 'volume')}
              onMouseUp={handleMouseUp}
              ref={volumeRef}>
            <div className={classes.volume__bar} style={{ width: `${volume * 100}%` }}></div>
          </div>
        </div>
      </div>
      <div className={classes.navigator__wrapper} onClick={checkWidth} ref={clickRef}>
        <div className={classes.seek__bar} style={{width: `${currentSong.progress+"%"}`}}></div>
      </div>
      </div>
    </div>
  
  )
}

export default Player