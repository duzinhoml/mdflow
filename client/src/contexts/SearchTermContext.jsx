import { useState, useContext, createContext } from 'react';

import { useUser } from './UserContext.jsx';
import { useSong } from './SongContext.jsx';

const SearchTermContext = createContext();

export const SearchTermProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Setlists")

    const { userData } = useUser();
    const { currentSetlist } = useSong();

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
    }

    const clearSearch = () => {
        if (searchTerm) setSearchTerm("");
    }

    const handleToggleFilter = (newFilter) => newFilter !== filter && setFilter(newFilter);

    const searchedItems = (filter) => {
        if (currentSetlist && filter === "Songs") return currentSetlist.songs.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];
        return userData?.[filter.toLowerCase()].filter(filteredItem => filteredItem.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];
    };
    const filteredItems = (filter) => userData?.[filter.toLowerCase()].filter(filteredItem => filteredItem) || [];

    const value = {
        searchTerm, filter,
        handleSearch, clearSearch, handleToggleFilter,
        searchedItems, filteredItems
    }

    return (
        <SearchTermContext.Provider value={value}>
            {children}
        </SearchTermContext.Provider>
    );
};

export const useSearch = () => useContext(SearchTermContext);