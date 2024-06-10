import React from 'react';
import '../styles/App.css'
import Navbar from './Navbar/Navbar';
import Playlists from './Playlists/Playlists';

const Menu = ({playSong}) => {
    return (
        <div className='menu'>
            <Navbar></Navbar>
            <Playlists playSong={playSong}></Playlists>
        </div>
    );
}

export default Menu;
