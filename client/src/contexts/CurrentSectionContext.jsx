import { useState, useEffect, useContext, createContext } from 'react';
import { useCurrentSong } from './CurrentSongContext.jsx';

const CurrentSectionContext = createContext();

export const CurrentSectionProvider = ({ children }) => {
    const [currentSection, setCurrentSection] = useState(null);
    const { currentSong } = useCurrentSong();

    useEffect(() => {
        setCurrentSection(null);
    }, [currentSong]);

    return (
        <CurrentSectionContext.Provider value={{ currentSection, setCurrentSection }}>
            {children}
        </CurrentSectionContext.Provider>
    );
};

export const useCurrentSection = () => useContext(CurrentSectionContext);