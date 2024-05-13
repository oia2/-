import React, { createContext, useState, useEffect } from 'react';
import MusicService from '../src/services/MusicService';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [music, setMusic] = useState([]);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await MusicService.fetchMusic();
                setMusic(response.data);
            } catch (e) {
                console.log("Error fetching music: ", e);
            }
        };
        fetchMusic();
    }, []);

    return (
        <MusicContext.Provider value={{ music, setMusic }}>
            {children}
        </MusicContext.Provider>
    );
};
