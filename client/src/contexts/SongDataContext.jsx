import { useState, useContext, createContext } from 'react';

const SongDataContext = createContext();

export const SongDataProvider = ({ children }) => {
    const [songData, setSongData] = useState({
        title: '',
        sections: []
    });

    return (
        <SongDataContext.Provider value={{ songData, setSongData }}>
            {children}
        </SongDataContext.Provider>
    );
};

export const useSongData = () => useContext(SongDataContext);