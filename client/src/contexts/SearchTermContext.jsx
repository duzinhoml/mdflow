import { useState, useContext, createContext } from 'react';

import { useUser } from './UserContext.jsx';

const SearchTermContext = createContext();

export const SearchTermProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { userData } = useUser();

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
    }

    const clearSearch = () => {
        if (searchTerm) setSearchTerm("");
    }

    const searchedSongs = userData?.songs.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

    return (
        <SearchTermContext.Provider value={{ searchTerm, searchedSongs, handleSearch, clearSearch }}>
            {children}
        </SearchTermContext.Provider>
    );
};

export const useSearch = () => useContext(SearchTermContext);