import { useState, useContext, createContext } from 'react';

const CurrentSongContext = createContext();

export const CurrentSongProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);

    const handleSetCurrentSong = (song) => {
        if (song._id === 'createSong') {
            setCurrentSong(null)
            return;
        }

        if (currentSong?._id === song._id) setCurrentSong(null);
        else setCurrentSong(song);
    }

    return (
        <CurrentSongContext.Provider value={{ currentSong, setCurrentSong, handleSetCurrentSong }}>
            {children}
        </CurrentSongContext.Provider>
    );
};

export const useCurrentSong = () => useContext(CurrentSongContext);