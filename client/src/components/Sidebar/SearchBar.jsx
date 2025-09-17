import { useSong } from "../../contexts/SongContext.jsx";
import { useSearch } from "../../contexts/SearchTermContext.jsx";

function SearchBar() {
    const { currentSetlist } = useSong();
    const { searchTerm, filter, handleSearch, clearSearch, searchedItems } = useSearch();

    return (
        <div className="mt-3 mx-3">
            <div className="d-flex">
                <span className="input-group-text rounded-end-0" style={{ cursor: 'pointer', maxWidth: '38px' }} onClick={clearSearch}>
                    {searchTerm ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                </span>
                <input 
                    name="searchBar"
                    className="w-100 border rounded-2 rounded-start-0 p-1 ps-2 fs-6" 
                    style={{ outlineColor: 'hsl(235, 13%, 42%)' }}
                    type="text" 
                    value={searchTerm}
                    placeholder={`Search ${filter}`}
                    onChange={(e) => handleSearch(e)}
                    autoComplete="off"
                    disabled={currentSetlist && filter === "Setlists" ? true : false}
                />
            </div>
            {searchTerm && 
                <p className="m-0 mt-3 fs-6 text-wrap text-light">
                    {searchedItems(filter).length ? (
                        <>
                            All {filter.toLowerCase()} matching <span className="text-danger">{searchTerm}</span> are displayed below
                        </>
                    ) : ("No results found")
                    }
                </p>}
        </div>
    );
};

export default SearchBar;