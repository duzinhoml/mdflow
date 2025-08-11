import { useDeleteSong, useSearch } from "../lib/constants";

import { useUser } from "../contexts/UserContext";
import { useToggleVisible } from "../contexts/ToggleVisibleContext";
import { useCurrentSong } from "../contexts/CurrentSongContext";

function Sidebar() {
    const handleDeleteSong = useDeleteSong();
    const { searchTerm, searchedSongs, handleSearch, clearSearch } = useSearch();

    const { userData } = useUser();
    const { visible } = useToggleVisible();
    const { handleSetCurrentSong } = useCurrentSong();

    return (
        visible.sidebar && 
            <div 
                className='bg-secondary position-absolute end-0 d-flex flex-column overflow-hidden' 
                style={{ width: '25vw', height: 'calc(100% - 60px)', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}
            >
                {/* Search Bar */}
                <div className="mt-3 mx-3">
                    <div className="d-flex">
                        <span className="input-group-text rounded-end-0" style={{ cursor: 'pointer' }} onClick={clearSearch}>
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

                <hr className="mb-1" style={{ border: '2px solid black' }}/>
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
            </div>
    );
};

export default Sidebar;