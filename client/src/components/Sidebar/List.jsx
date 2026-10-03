import { useSearch } from "../../contexts/SearchTermContext.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import { useSong } from "../../contexts/SongContext.jsx";

import FilterLogic from "./FilterLogic.jsx";
import './index.css';

function List() {
    const { filter, handleToggleFilter } = useSearch();
    const { userData } = useUser();
    const { currentSetlist } = useSong();

    const setlistsCount = userData?.setlists?.length || 0;
    const songsCount = currentSetlist 
        ? (currentSetlist.songs?.length || 0) 
        : (userData?.songs?.length || 0);

    return (
        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
            {/* Segmented Filter Pills */}
            <div className="sidebar-tabs">
                <button 
                    type="button"
                    className={`sidebar-tab-pill ${filter === "Setlists" ? 'current' : ''}`} 
                    onClick={() => handleToggleFilter("Setlists")}
                >
                    <i className="fa-solid fa-list-ul"></i>
                    <span>Setlists</span>
                    <span className="badge bg-dark bg-opacity-50 text-light" style={{ fontSize: '10px' }}>
                        {setlistsCount}
                    </span>
                </button>

                <button 
                    type="button"
                    className={`sidebar-tab-pill ${filter === "Songs" ? 'current' : ''}`} 
                    onClick={() => handleToggleFilter("Songs")}
                >
                    <i className="fa-solid fa-music"></i>
                    <span>Songs</span>
                    <span className="badge bg-dark bg-opacity-50 text-light" style={{ fontSize: '10px' }}>
                        {songsCount}
                    </span>
                </button>
            </div>

            {/* Scrollable Items Container */}
            <div className="flex-grow-1 overflow-y-auto px-3 py-2">
                <FilterLogic />
            </div>
        </div>
    );
};

export default List;