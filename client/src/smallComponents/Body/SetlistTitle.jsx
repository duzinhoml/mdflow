import { useSongData } from "../../contexts/SongDataContext";
import { useSong } from "../../contexts/SongContext";
import { useUpdateSetlistTitle } from "../../lib/constants";

import './index.css';

function SetlistTitle() {
    const { setlistData } = useSongData();
    const { currentSetlist } = useSong();
    const handleInputChange = useUpdateSetlistTitle();

    return (
        <div className="d-flex justify-content-center my-2 px-2">
            <div className="setlist-pill-box" style={{ maxWidth: '92vw' }}>
                <i 
                    className={`fa-solid ${currentSetlist ? 'fa-list-check' : 'fa-folder-plus'}`}
                    style={{ color: currentSetlist ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '13px' }}
                ></i>
                <input 
                    name={currentSetlist ? 'currentSetlistTitle' : 'setlistTitle'}
                    type="text" 
                    className="setlist-input flex-grow-1"
                    placeholder="Enter setlist name..."
                    onChange={handleInputChange} 
                    value={setlistData.title}
                    autoComplete='off'
                />
                {currentSetlist && (
                    <span className="badge bg-dark bg-opacity-50 text-light" style={{ fontSize: '10px' }}>
                        {currentSetlist.songs?.length || 0}
                    </span>
                )}
            </div>
        </div>
    );
};

export default SetlistTitle;