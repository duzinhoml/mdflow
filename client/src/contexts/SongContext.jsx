import { useState, useEffect, useContext, createContext } from 'react';

const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [currentSetlist, setCurrentSetlist] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSections, setCurrentSections] = useState([]);
    const [currentSection, setCurrentSection] = useState(null);

    const songs = currentSetlist?.songs;

    const handleSetCurrent = (filter, item) => {
        if (filter === "Setlists") {
            if (currentSetlist?._id === item._id) {
                setCurrentSetlist(null);
                setCurrentSong(null);
            }
            else setCurrentSetlist(item);
        }
        else {
            if (!currentSetlist) return;
            if (currentSong?._id === item._id) setCurrentSong(null);
            else setCurrentSong(item);
        }
    }
    
    useEffect(() => {
        if (!currentSong?.sections?.find(section => section._id === currentSection?._id)) setCurrentSection(null);
    }, [currentSong]);

    const prevSong = (song) => {
        if (!song) return;
        const activeIndex = songs.findIndex(s => s._id === song._id);

        if (activeIndex <=0) return;
        setCurrentSong(songs[activeIndex - 1]);
    }

    const nextSong = (song) => {
        if (!song) return;
        const activeIndex = songs.findIndex(s => s._id === song._id);
        
        if (activeIndex < 0 || activeIndex === (songs.length - 1)) return;
        setCurrentSong(songs[activeIndex + 1]);
    }

    const value = {
        currentSetlist, setCurrentSetlist,
        currentSong, setCurrentSong, handleSetCurrent,
        currentSections, setCurrentSections,
        currentSection, setCurrentSection,
        prevSong, nextSong
    }

    return (
        <SongContext.Provider value={value}>
            {children}
        </SongContext.Provider>
    );
};

export const useSong = () => useContext(SongContext);