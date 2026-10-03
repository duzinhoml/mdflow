import { useState, useContext, createContext } from 'react';

const SongDataContext = createContext();

export const SongDataProvider = ({ children }) => {
    const [setlistData, setSetlistData] = useState({
        title: ''
    });

    const [songData, setSongData] = useState({
        title: '',
        bpm: 120,
        timeSignature: '4/4',
        sections: []
    });

    const value = {
        setlistData, setSetlistData,
        songData, setSongData
    }

    return (
        <SongDataContext.Provider value={value}>
            {children}
        </SongDataContext.Provider>
    );
};

export const useSongData = () => useContext(SongDataContext);