import { useState, useEffect, useContext, createContext } from 'react';

const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [currentSetlist, setCurrentSetlist] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSections, setCurrentSections] = useState([]);
    const [currentSection, setCurrentSection] = useState(null);

    const songs = currentSetlist?.songs;

    const selectSetlist = (setlist) => {
        if (!setlist) {
            setCurrentSetlist(null);
            setCurrentSong(null);
            return;
        }
        setCurrentSetlist(setlist);
        if (setlist.songs && setlist.songs.length > 0) {
            setCurrentSong(setlist.songs[0]);
        } else {
            setCurrentSong(null);
        }
    };

    const handleSetCurrent = (filter, item) => {
        if (filter === "Setlists") {
            if (currentSetlist?._id === item._id) {
                selectSetlist(null);
            }
            else {
                selectSetlist(item);
            }
        }
        else {
            if (!currentSetlist) return;
            if (currentSong?._id === item._id) setCurrentSong(null);
            else setCurrentSong(item);
        }
    };
    
    useEffect(() => {
        if (!currentSong?.sections?.find(section => section._id === currentSection?._id)) {
            setCurrentSection(null);
        }
    }, [currentSong, currentSection?._id]);

    const prevSong = (song) => {
        if (!song || !songs) return;
        const activeIndex = songs.findIndex(s => s._id === song._id);

        if (activeIndex <= 0) return;
        setCurrentSong(songs[activeIndex - 1]);
    };

    const nextSong = (song) => {
        if (!song || !songs) return;
        const activeIndex = songs.findIndex(s => s._id === song._id);
        
        if (activeIndex < 0 || activeIndex >= (songs.length - 1)) return;
        setCurrentSong(songs[activeIndex + 1]);
    };

    const value = {
        currentSetlist, setCurrentSetlist, selectSetlist,
        currentSong, setCurrentSong, handleSetCurrent,
        currentSections, setCurrentSections,
        currentSection, setCurrentSection,
        prevSong, nextSong
    };

    return (
        <SongContext.Provider value={value}>
            {children}
        </SongContext.Provider>
    );
};

export const useSong = () => useContext(SongContext);