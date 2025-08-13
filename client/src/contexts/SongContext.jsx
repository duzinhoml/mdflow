import { useState, useEffect, useContext, createContext } from 'react';

const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSections, setCurrentSections] = useState([]);
    const [currentSection, setCurrentSection] = useState(null);
    
    const handleSetCurrentSong = (song) => {
        if (song._id === 'createSong') {
            setCurrentSong(null)
            return;
        }
        
        if (currentSong?._id === song._id) setCurrentSong(null);
        else setCurrentSong(song);
    }
    
    useEffect(() => {
        if (!currentSong?.sections.find(section => section._id === currentSection?._id)) setCurrentSection(null);
    }, [currentSong]);

    const value = {
        currentSong, setCurrentSong, handleSetCurrentSong,
        currentSections, setCurrentSections,
        currentSection, setCurrentSection
    }

    return (
        <SongContext.Provider value={value}>
            {children}
        </SongContext.Provider>
    );
};

export const useSong = () => useContext(SongContext);