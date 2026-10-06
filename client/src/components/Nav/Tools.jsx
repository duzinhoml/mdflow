import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';
import { useSong } from '../../contexts/SongContext.jsx';
import './index.css';

function Tools() {
    const { visible, toggleVisible } = useToggleVisible();
    const { currentSong } = useSong();

    return (
        <div className="d-flex align-items-center gap-2">
            {/* Palette Toggle */}
            <button 
                type="button"
                className={`nav-toggle-btn ${visible.selector ? 'active' : ''}`}
                onClick={() => currentSong && toggleVisible('selector')}
                disabled={!currentSong}
                style={{
                    opacity: currentSong ? 1 : 0.45,
                    cursor: currentSong ? 'pointer' : 'not-allowed'
                }}
                title={currentSong ? "Toggle Element Palette (Sections, Dynamics, Instruments)" : "Select a song first to open arrangement palette"}
            >
                <i className="fa-solid fa-sliders"></i>
                <span className="d-none d-md-inline">Palette</span>
            </button>

            {/* Library Sidebar Toggle */}
            <button 
                type="button"
                className={`nav-toggle-btn ${visible.sidebar ? 'active' : ''}`}
                onClick={() => toggleVisible('sidebar')}
                title="Toggle Library Browser (Setlists & Songs)"
            >
                <i className="fa-solid fa-folder-open"></i>
                <span className="d-none d-md-inline">Library</span>
            </button>
        </div>
    );
};

export default Tools;