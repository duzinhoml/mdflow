import { useSearch } from "../../../contexts/SearchTermContext";

import FilterLogic from "../../../components/Sidebar/FilterLogic";
import './index.css';

function List() {
    const { filter, handleToggleFilter } = useSearch();

    return (
        <div className="overflow-y-scroll flex-grow-1 sm-list">

            <div className="d-flex justify-content-center gap-3">
                <button className={`btn tabs pb-1 ${filter === "Setlists" && 'current'}`} onClick={() => handleToggleFilter("Setlists")}>
                    Setlists
                </button>
                <button className={`btn tabs pb-1 ${filter === "Songs" && 'current'}`} onClick={() => handleToggleFilter("Songs")}>
                    Songs
                </button>
            </div>

            <ul className="list-group m-3">
                <FilterLogic />
            </ul>
        </div>
    );
}

export default List;