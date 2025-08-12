import { useDeleteSong } from "../../lib/constants.js";

import { useUser } from "../../contexts/UserContext";
import { useCurrentSong } from "../../contexts/CurrentSongContext.jsx";
import { useSearch } from "../../contexts/SearchTermContext.jsx";

function List() {
    const handleDeleteSong = useDeleteSong();

    const { userData } = useUser();
    const { handleSetCurrentSong } = useCurrentSong();
    const { searchTerm, searchedSongs } = useSearch();

    return (
        <div className="overflow-y-scroll flex-grow-1">
            <ul className="list-group m-3">
                {searchTerm ? searchedSongs.map(song => (
                    <div key={song._id} className="d-flex align-items-center mb-3">
                        <button 
                            className="btn btn-lg list-group-item py-2 rounded-2 flex-grow-1 text-start" 
                            onClick={() => handleSetCurrentSong(song)}
                        >
                            {song.title}
                        </button>
                        <button className="btn btn-danger ms-2" onClick={() => handleDeleteSong(song._id)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                )) : userData?.songs.map(song => (
                    <div key={song._id} className="d-flex align-items-center mb-3">
                        <button 
                            className="btn btn-lg list-group-item py-2 rounded-2 flex-grow-1 text-start" 
                            onClick={() => handleSetCurrentSong(song)}
                        >
                            {song.title}
                        </button>
                        <button className="btn btn-danger ms-2" onClick={() => handleDeleteSong(song._id)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default List;