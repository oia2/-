import React, { useState, useEffect, useRef, useContext } from 'react';
import classes from './MyInput.module.css';
import { MusicContext } from '../../../../MusicContext/MusicContext';
import SearchItem from '../SearchItem/SearchItem';

const MyInput = ({playSong}) => {
    const { music, setMusic } = useContext(MusicContext);
    const [inputText, setInputText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const inputRef = useRef(null);
    const menuRef = useRef(null);
 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (event) => {
        const newText = event.target.value;
        setInputText(newText);
        setMenuVisible(newText.length > 0);
    };

    const handleInputClick = () => {
        if (inputText.length > 0) {
            setMenuVisible(true);
        }
    };

    const filteredSongs = music.filter(song => song.title.toLowerCase().includes(inputText.toLowerCase())).slice(0, 3);

    return (
        <div className={classes.input__wrapper}>
            <input
                ref={inputRef}
                className={classes.input}
                type="text"
                placeholder="Поиск музыки..."
                value={inputText}
                onChange={handleInputChange}
                onClick={handleInputClick}
            />
            <div ref={menuRef} className={`${classes.menu} ${menuVisible ? classes.active : ''}`}>
                <div className={classes.line}></div>
                <p className={classes.tittleTracks}>Треки</p>
                {filteredSongs.length > 0 ? (
                    filteredSongs.map(song => <SearchItem key={song.title} song={song} playSong={playSong}/>)
                ) : (
                    <p className={classes.noResults}>Ничего не найдено</p>
                )}
            </div>
        </div>
    );
}

export default MyInput;
