import { useState, useContext, createContext, use } from 'react';

const CurrentSectionsContext = createContext();

export const CurrentSectionsProvider = ({ children }) => {
    const [currentSections, setCurrentSections] = useState([]);

    return (
        <CurrentSectionsContext.Provider value={{ currentSections, setCurrentSections }}>
            {children}
        </CurrentSectionsContext.Provider>
    );
};

export const useCurrentSections = () => useContext(CurrentSectionsContext);