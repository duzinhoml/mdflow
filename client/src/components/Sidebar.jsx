import { useDeleteSong } from "../lib/constants";

import { useUser } from "../contexts/UserContext";
import { useToggleVisible } from "../contexts/ToggleVisibleContext";
import { useCurrentSong } from "../contexts/CurrentSongContext";

function Sidebar() {
    const handleDeleteSong = useDeleteSong();

    const { userData } = useUser();
    const { visible } = useToggleVisible();
    const { handleSetCurrentSong } = useCurrentSong();

    return (
        visible.sidebar && 
            <div className='bg-danger position-absolute end-0 overflow-y-auto' style={{ minWidth: '25vw', height: 'calc(100% - 56px)' }}>
                <ul className="list-group m-3">
                    {userData?.songs.map(song => (
                        <div key={song._id} className="d-flex align-items-center mb-3">
                            <li 
                                className="list-group-item py-2 rounded-2 flex-grow-1" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSetCurrentSong(song)}
                            >
                                {song.title}
                            </li>
                            <button className="btn btn-secondary ms-2" onClick={() => handleDeleteSong(song._id)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
    );
};

export default Sidebar;