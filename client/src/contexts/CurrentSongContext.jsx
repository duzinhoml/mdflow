import { useState, useContext, createContext } from 'react';
import { useEditing } from './EditingContext';

const CurrentSongContext = createContext();

export const CurrentSongProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const { setIsEditing } = useEditing();

    const handleSetCurrentSong = (song) => {
        if (currentSong?._id === song._id) setCurrentSong(null);
        else setCurrentSong(song);

        setIsEditing(false);
    }

    return (
        <CurrentSongContext.Provider value={{ currentSong, setCurrentSong, handleSetCurrentSong }}>
            {children}
        </CurrentSongContext.Provider>
    );
};

export const useCurrentSong = () => useContext(CurrentSongContext);