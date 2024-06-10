import React, { useState, useEffect, useContext } from 'react';
import classes from './Playlists.module.css';
import musicSvg from '../../svg/music.svg';
import plusSvg from '../../svg/plus.svg';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import { MusicContext } from '../../../MusicContext/MusicContext';
import MusicItem from '../UI/MusicItem/MusicItem';
import PlayListItem from '../UI/PlayLIstItem/PlayListItem';
import axios from 'axios';

const Playlists = ({ playSong }) => {
    const { music } = useContext(MusicContext);
    const [inputText, setInputText] = useState('');
    const { store } = useContext(Context);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/playlists`, {
                    params: { userId: store.user.id }
                });
                setPlaylists(response.data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        if (store.isAuth) {
            fetchPlaylists();
        } else {
            setPlaylists([]); // Очистка плейлистов при выходе
            setPlaylistSongs([]); // Очистка песен при выходе
            setSelectedPlaylist(null); // Сброс выбранного плейлиста при выходе
        }
    }, [store.isAuth, store.user.id]);

    const handlePlusButtonClick = () => {
        if (store.isAuth) {
            setSelectedPlaylist(null); // Сброс выбранного плейлиста при отображении всех песен
            setIsMenuVisible(!isMenuVisible);
        }
    };

    const handleInputChange = (event) => {
        const newText = event.target.value;
        setInputText(newText);
    };

    const handlePlaylistClick = async (playlistId) => {
        console.log(playlistId);
        setSelectedPlaylist(playlistId);
        try {
            const response = await axios.get(`http://localhost:5000/api/playlist-songs`, {
                params: { playlistId }
            });
            setPlaylistSongs(response.data);
            setIsMenuVisible(true); // Показать меню с песнями из выбранного плейлиста
        } catch (error) {
            console.error('Error fetching playlist songs:', error);
        }
    };

    const handleDeletePlaylist = async () => {
        if (selectedPlaylist) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/playlists/${selectedPlaylist}`, {
                    data: { userId: store.user.id }
                });
                console.log(response.data);
                setPlaylists(playlists.filter(playlist => playlist.playlistid !== selectedPlaylist));
                setSelectedPlaylist(null);
                setIsMenuVisible(false);
            } catch (error) {
                console.error('Error deleting playlist:', error);
            }
        }
    };

    const handleCreatePlaylist = async (e) => {
        if (e.key === 'Enter') {
            try {
                const response = await axios.post(`http://localhost:5000/api/createPlaylist`, {
                    userId: store.user.id,
                    title: newPlaylistTitle
                });
                setPlaylists([...playlists, { playlistid: response.data.playlistid, title: response.data.title, hasTrack: false }]);
                setNewPlaylistTitle('');
            } catch (error) {
                console.error('Error creating playlist:', error);
            }
        }
    };

    const filteredSongs = music.filter(song => song.title.toLowerCase().includes(inputText.toLowerCase()));

    return (
        <div className={classes.playlists}>
            <div className={classes.head}>
                <div className={classes.head__text}>
                    <img className={classes.head__img} src={musicSvg} alt="" />
                    <span className={classes.head__span}>Моя коллекция</span>
                </div>
                <button className={classes.plusImg__btn} onClick={handlePlusButtonClick}>
                    <img className={classes.plusImg} src={plusSvg} alt="" />
                </button>
                <div className={`${classes.menu} ${isMenuVisible ? classes.visible : ''}`}>
                    <div className={classes.menu__header}>
                        <input 
                            value={inputText} 
                            onChange={handleInputChange}
                            className={classes.input} 
                            type="text" 
                            placeholder="Поиск музыки..." 
                        />
                        {selectedPlaylist && playlists.find(playlist => playlist.playlistid === selectedPlaylist).title !== "Мне нравится" && (
                            <button className={classes.btn__delete} onClick={handleDeletePlaylist}>
                                Удалить плейлист
                            </button>
                        )}
                        <button className={classes.crossImg__btn} onClick={() => setIsMenuVisible(false)}>
                            <img className={classes.crossImg} src={plusSvg} alt="" />
                        </button>
                    </div>
                    <div className={classes.menu__content}>
                        <p className={classes.content__title}>Треки</p>
                        <div className={classes.menu__content}>
                            {selectedPlaylist ? (
                                playlistSongs.length > 0 ? (
                                    playlistSongs.map(song => (
                                        <MusicItem 
                                            key={song.id} 
                                            song={song} 
                                            playSong={playSong} 
                                            inPlaylist={selectedPlaylist} 
                                            isLikedPlaylist={playlists.find(playlist => playlist.playlistid === selectedPlaylist).title === 'Мне нравится'}
                                            onRemove={id => setPlaylistSongs(playlistSongs.filter(song => song.id !== id))}
                                            updatePlaylists={setPlaylists}
                                        />
                                    ))
                                ) : (
                                    <p className={classes.noResults}>Нет песен в этом плейлисте</p>
                                )
                            ) : (
                                filteredSongs.length > 0 ? (
                                    filteredSongs.map(song => (
                                        <MusicItem 
                                            key={song.title} 
                                            song={song} 
                                            playSong={playSong} 
                                            updatePlaylists={setPlaylists} 
                                        />
                                    ))
                                ) : (
                                    <p className={classes.noResults}>Ничего не найдено</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.plugArea}>
                <div className={classes.plugList}>
                    {playlists.length > 0 ? (
                        playlists.map(playlist => (
                            <PlayListItem 
                                key={playlist.playlistid} 
                                title={playlist.title} 
                                onClick={() => handlePlaylistClick(playlist.playlistid)} 
                                imageUrl={playlist.imageUrl} // передача URL изображения
                            />
                        ))
                    ) : (
                        <div className={classes.plug}>
                            <span className={classes.plug__text}>Создай свой первый плейлист</span>
                            <span className={classes.plug__discription}>Это очень просто!</span>
                            <button className={classes.plug__button} onClick={handlePlusButtonClick}>Создать плейлист</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(Playlists);
