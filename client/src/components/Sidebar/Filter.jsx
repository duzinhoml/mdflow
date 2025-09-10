import { useDelete } from "../../lib/constants.js";

import { useSong } from "../../contexts/SongContext.jsx";

import './index.css';

function Filter({ item, filter }) {
    const handleDelete = useDelete();
    
    const { currentSetlist, currentSong, handleSetCurrent } = useSong();

    const handleCurrentItem = () => {
        if (currentSetlist?._id === item._id && filter === "Setlists") return 'current';
        if (currentSong?._id === item._id && filter === "Songs") return 'current';
        return '';
    }

    return (
        <div key={item._id} className="d-flex flex-column align-items-center mb-3">
            {(currentSetlist?._id === item._id && filter === "Setlists") &&
                <span className="fs-6 fst-italic align-self-start mb-1 text-light">
                    Current Setlist - click again to deactivate
                </span>}
            {(currentSong?._id === item._id && filter === "Songs") &&
                <span className="fs-6 fst-italic align-self-start mb-1 text-light">
                    Current Song - click again to deactivate
                </span>}

            <div className="d-flex w-100">
                <button 
                    className={`btn btn-lg list-group-item py-2 rounded-2 flex-grow-1 d-flex text-start list ${handleCurrentItem()}`} 
                    onClick={() => handleSetCurrent(filter, item)}
                    style={{ overflow: "scroll" }}
                >
                    {item.title}
                </button>
                <button className="btn btn-danger ms-2" onClick={() => handleDelete(filter, item._id)}>
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default Filter;