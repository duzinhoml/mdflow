import { useSong } from "../../contexts/SongContext.jsx";
import { useSearch } from "../../contexts/SearchTermContext.jsx";

import FilterLogic from "./FilterLogic.jsx";
import './index.css';

function List() {
    const { currentSetlist } = useSong();
    const { searchTerm, filter, handleToggleFilter, searchedItems, filteredItems } = useSearch();

    return (
        <div className="overflow-y-scroll flex-grow-1">

            <div className="d-flex justify-content-center gap-3">
                <button className={`btn tabs pb-1 ${filter === "Setlists" && 'current'}`} onClick={() => handleToggleFilter("Setlists")}>
                    Setlists
                </button>
                <button className={`btn tabs pb-1 ${filter === "Songs" && 'current'}`} onClick={() => handleToggleFilter("Songs")}>
                    Songs
                </button>
            </div>

            <ul className="list-group m-3">
                <FilterLogic 
                    currentSetlist={currentSetlist}
                    filter={filter}
                    searchTerm={searchTerm}
                    searchedItems={searchedItems}
                    filteredItems={filteredItems}
                />
            </ul>
        </div>
    );
};

export default List;