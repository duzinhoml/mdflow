import { useSearch } from "../../contexts/SearchTermContext.jsx";

function SearchBar() {
    const { searchTerm, handleSearch, clearSearch } = useSearch();

    return (
        <div className="mt-3 mx-3">
            <div className="d-flex">
                <span className="input-group-text rounded-end-0" style={{ cursor: 'pointer', maxWidth: '38px' }} onClick={clearSearch}>
                    {searchTerm ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                </span>
                <input 
                    className="w-100 border rounded-2 rounded-start-0 p-1 ps-2 fs-6" 
                    type="text" 
                    value={searchTerm}
                    placeholder="Search Songs"
                    onChange={(e) => handleSearch(e)}
                />
            </div>
            {searchTerm && <p className="m-0 mt-2 fs-6 text-wrap">All songs matching <span className="text-danger">{searchTerm}</span> are displayed below</p>}
        </div>
    );
};

export default SearchBar;