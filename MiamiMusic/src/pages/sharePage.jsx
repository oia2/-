import { useRef, useState, useEffect } from 'react';
import Menu from '../components/Menu';
import MusicService from '../services/MusicService';
import CenterBlock from '../components/CenterBlock/CenterBlock';
import Player from '../components/player/player';
import ShareForm from '../components/shareForm/shareForm';

const SharePage = () => {
    const [songs, setSongs] = useState([]);
    const [isplaying, setisplaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const audioElem = useRef();

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await MusicService.fetchMusic();
                setSongs(response.data);
                if (response.data.length > 0) {
                    setCurrentSong(response.data[0]);
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
        setisplaying(false);
    }
  };
    return (
        
        <div className="wrapper">
            <audio src={`http://localhost:5000${currentSong?.url}`} ref={audioElem} onTimeUpdate={onPlaying} />
            <Player songs={songs} setSongs={setSongs} isplaying={isplaying} setisplaying={setisplaying} audioElem={audioElem} currentSong={currentSong} setCurrentSong={setCurrentSong} />
            <Menu playSong={handlePlaySong}></Menu>
            <ShareForm playSong={handlePlaySong}> </ShareForm>
            
      </div>
    );
}

export default SharePage;
