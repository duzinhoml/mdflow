import { useState, useContext, createContext, use } from 'react';

const CurrentSectionContext = createContext();

export const CurrentSectionProvider = ({ children }) => {
    const [currentSection, setCurrentSection] = useState(null);

    return (
        <CurrentSectionContext.Provider value={{ currentSection, setCurrentSection }}>
            {children}
        </CurrentSectionContext.Provider>
    );
};

export const useCurrentSection = () => useContext(CurrentSectionContext);