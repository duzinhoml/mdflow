import { useSong } from "../../contexts/SongContext.jsx";
import { useSearch } from "../../contexts/SearchTermContext.jsx";

function SearchBar() {
    const { currentSetlist } = useSong();
    const { searchTerm, filter, handleSearch, clearSearch, searchedItems } = useSearch();

    const resultsCount = searchTerm ? searchedItems(filter).length : 0;

    return (
        <div className="d-flex flex-column px-3 pt-2 pb-1">
            <div className="sidebar-search-box">
                <i className="fa-solid fa-magnifying-glass text-muted" style={{ fontSize: '12px' }}></i>
                
                <input 
                    name="searchBar"
                    className="sidebar-search-input" 
                    type="text" 
                    value={searchTerm}
                    placeholder={`Search ${filter.toLowerCase()}...`}
                    onChange={(e) => handleSearch(e)}
                    autoComplete="off"
                    disabled={currentSetlist && filter === "Setlists" ? false : false}
                />

                {searchTerm && (
                    <button 
                        type="button"
                        className="btn btn-sm text-muted p-0"
                        onClick={clearSearch}
                        title="Clear search"
                        style={{ fontSize: '12px' }}
                    >
                        <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                )}
            </div>

            {searchTerm && (
                <div className="d-flex align-items-center justify-content-between px-1 mt-1 text-muted" style={{ fontSize: '11px' }}>
                    <span>Results for <strong className="text-light">"{searchTerm}"</strong>:</span>
                    <span className="badge bg-secondary bg-opacity-25 text-light">{resultsCount} found</span>
                </div>
            )}
        </div>
    );
};

export default SearchBar;