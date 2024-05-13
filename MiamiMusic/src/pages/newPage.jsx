import { useRef, useState, useEffect } from 'react';
import Menu from '../components/Menu';
import CenterBlockNew from '../components/CenterBlockNew/CenterBlockNew';
import Player from '../components/player/player';
import MusicService from '../services/MusicService';

const NewPage = () => {
  const [songs, setSongs] = useState([]);
  const [isplaying, setisplaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null); // Изначально null
  const audioElem = useRef();

  useEffect(() => {
      const fetchMusic = async () => {
          try {
              const response = await MusicService.fetchMusic();
              setSongs(response.data);
              if (response.data.length > 0) {
                  setCurrentSong(response.data[0]);  // Установка после загрузки
              }
          } catch (e) {
              console.log("Error fetching music: ", e);
          }
      };
      fetchMusic();
  }, []);

  useEffect(() => {
    if (isplaying) {
      audioElem.current.play();
    }
    else {
      audioElem.current.pause();
    }
  }, [isplaying, currentSong])

  const onPlaying = () => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;

    setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })

  }

  const handlePlaySong = (song) => {
    if (song) {
      setCurrentSong(song);
      setisplaying(true);
  } else {
      setisplaying(false);  // Останавливаем воспроизведение
  }
};
    return (
        
        <div className="wrapper">
           <audio src={`http://localhost:5000${currentSong?.url}`} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player songs={songs} setSongs={setSongs} isplaying={isplaying} setisplaying={setisplaying} audioElem={audioElem} currentSong={currentSong} setCurrentSong={setCurrentSong} />
            <Menu></Menu>
            <CenterBlockNew playSong={handlePlaySong}></CenterBlockNew>
      </div>
    );
}

export default NewPage;
