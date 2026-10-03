import { useSongData } from '../../contexts/SongDataContext.jsx';
import { useSong } from '../../contexts/SongContext.jsx';
import { useUpdateSetlistTitle } from '../../lib/constants.js';

function SetlistTitle() {
    const { setlistData } = useSongData();
    const { currentSetlist } = useSong();
    const handleInputChange = useUpdateSetlistTitle();

    return (
        <div className="setlist-pill-box" title={currentSetlist ? "Edit current setlist title" : "Enter a title to create a new setlist"}>
            <i 
                className={`fa-solid ${currentSetlist ? 'fa-list-check' : 'fa-folder-plus'}`}
                style={{ color: currentSetlist ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '13px' }}
            ></i>
            
            <span className="setlist-label d-none d-md-inline">Setlist:</span>
            
            <input 
                name={currentSetlist ? 'currentSetlistTitle' : 'setlistTitle'}
                type="text" 
                className="setlist-input"
                placeholder="Enter setlist name..."
                onChange={handleInputChange} 
                value={setlistData.title}
                autoComplete='off'
            />

            {currentSetlist && (
                <span className="badge bg-dark bg-opacity-50 text-light d-none d-sm-inline" style={{ fontSize: '10px' }}>
                    {currentSetlist.songs?.length || 0} {currentSetlist.songs?.length === 1 ? 'song' : 'songs'}
                </span>
            )}
        </div>
    );
};

export default SetlistTitle;