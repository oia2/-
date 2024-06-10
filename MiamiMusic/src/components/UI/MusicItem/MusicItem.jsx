import React, { useState, useEffect, useContext } from 'react';
import classes from './MusicItem.module.css';
import imgPlay from '../../../svg/play_2.svg';
import imgStop from '../../../svg/pause_2.svg';
import blackHeart from '../../../svg/blackHeart.svg';
import redHeart from '../../../svg/red_heart.svg';
import plusSvg from '../../../svg/plus.svg';
import minus from '../../../svg/minus.svg';
import axios from 'axios';
import { Context } from '../../../main';
import { observer } from 'mobx-react-lite';

const MusicItem = ({ song, playSong, inPlaylist, onRemove, isLikedPlaylist }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showPlaylistList, setShowPlaylistList] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const { store } = useContext(Context);

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/isLiked', {
                    userId: store.user.id,
                    trackId: song.id
                });
                setIsLiked(response.data.isLiked);
            } catch (error) {
                console.error('Error checking if track is liked:', error);
            }
        };
        
        checkIfLiked();
    }, [song.id, store.user.id]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/playlists`, {
                    params: { userId: store.user.id }
                });

                const playlistsWithTracks = await Promise.all(response.data.map(async (playlist) => {
                    const trackResponse = await axios.post('http://localhost:5000/api/isTrackInPlaylist', {
                        userId: store.user.id,
                        trackId: song.id,
                        playlistId: playlist.playlistid
                    });
                    return {
                        ...playlist,
                        hasTrack: trackResponse.data.isInPlaylist
                    };
                }));

                setPlaylists(playlistsWithTracks);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, [store.user.id, song.id]);

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

    const handleLikeClick = async () => {
        try {
            const url = isLiked ? 'http://localhost:5000/api/unlike' : 'http://localhost:5000/api/like';
            const response = await axios.post(url, {
                userId: store.user.id,
                trackId: song.id
            });
            console.log(response.data);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error(`Error ${isLiked ? 'unliking' : 'liking'} track:`, error);
        }
    };

    const handlePlusClick = () => {
        setShowPlaylistList(!showPlaylistList);
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/addToPlaylist`, {
                userId: store.user.id,
                trackId: song.id,
                playlistId: playlistId
            });
            console.log(response.data);
            setPlaylists(playlists.map(playlist => 
                playlist.playlistid === playlistId ? { ...playlist, hasTrack: true } : playlist
            ));
        } catch (error) {
            console.error('Error adding track to playlist:', error);
        }
    };

    const handleRemoveFromPlaylist = async (playlistId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/removeFromPlaylist`, {
                userId: store.user.id,
                trackId: song.id,
                playlistId: playlistId
            });
            console.log(response.data);
            onRemove(song.id); // Обновление списка песен в родительском компоненте
            setPlaylists(playlists.map(playlist => 
                playlist.playlistid === playlistId ? { ...playlist, hasTrack: false } : playlist
            ));
        } catch (error) {
            console.error('Error removing track from playlist:', error);
        }
    };

    const handleCreatePlaylist = async (e) => {
        if (e.key === 'Enter') {
            try {
                const response = await axios.post(`http://localhost:5000/api/createPlaylist`, {
                    userId: store.user.id,
                    title: newPlaylistTitle
                });
                setPlaylists([...playlists, { ...response.data, hasTrack: false }]);
                setNewPlaylistTitle('');
            } catch (error) {
                console.error('Error creating playlist:', error);
            }
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
                                  <img className={classes.play__imgStop} src={imgStop} alt="Stop"/>
                              ) : (
                                  <img className={classes.play__imgPlay} src={imgPlay} alt="Play"/>
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
            <div className={classes.buttons}>
                <button className={classes.like} onClick={handleLikeClick}>
                    <img className={classes.likeIcon} src={isLiked ? redHeart : blackHeart} alt="Like" />
                </button>
                {inPlaylist && !isLikedPlaylist ? (
                    <button className={classes.minus} onClick={() => handleRemoveFromPlaylist(inPlaylist)}>
                        <img className={classes.minusIcon} src={minus} alt="-" />
                    </button>
                ) : (
                    (
                        <button className={classes.plus} onClick={handlePlusClick}>
                            <img className={classes.plusIcon} src={plusSvg} alt="+" />
                        </button>
                    )
                )}
                {showPlaylistList && (
                    <div className={classes.playlistList}>
                        <p className={classes.listTitle}>Добавить в плейлист</p>
                        <div className={classes.playlistListItems}>
                            {playlists.map(playlist => (
                                <div key={playlist.playlistid} className={classes.playlistListItem}>
                                    <p>{playlist.title}</p>
                                    <button 
                                        className={classes.plus} 
                                        onClick={() => 
                                            playlist.title === 'Мне нравится' 
                                            ? handleAddToPlaylist(playlist.playlistid) 
                                            : playlist.hasTrack 
                                                ? handleRemoveFromPlaylist(playlist.playlistid) 
                                                : handleAddToPlaylist(playlist.playlistid)
                                        }
                                    >
                                        <img 
                                            className={classes.plusIcon} 
                                            src={playlist.hasTrack ? minus : plusSvg} 
                                            alt={playlist.hasTrack ? "Remove" : "Add"} 
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input 
                            className={classes.inputCreate} 
                            type="text" 
                            placeholder="Создать плейлист"
                            value={newPlaylistTitle}
                            onChange={(e) => setNewPlaylistTitle(e.target.value)}
                            onKeyDown={handleCreatePlaylist}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(MusicItem);
