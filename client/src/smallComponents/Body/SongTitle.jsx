import { useState } from 'react';
import { useSongData } from "../../contexts/SongDataContext";
import { useSong } from "../../contexts/SongContext";
import { 
    useUpdateSongTitle, 
    useUpdateSongBpm, 
    useUpdateSongTimeSignature 
} from "../../lib/constants";

import './index.css';

const COMMON_TIME_SIGNATURES = ['4/4', '3/4', '6/8', '2/4', '12/8'];

function SongTitle() {
    const { songData, setSongData } = useSongData();
    const { currentSetlist, currentSong, setCurrentSong, prevSong, nextSong } = useSong();
    const handleInputChange = useUpdateSongTitle();
    const { bpm, handleBpmChange } = useUpdateSongBpm();
    const { timeSignature, handleTimeSignatureChange } = useUpdateSongTimeSignature();

    const [isTimeSigOpen, setIsTimeSigOpen] = useState(false);

    const songs = currentSetlist?.songs || [];
    const currentIndex = currentSong ? songs.findIndex(s => s._id === currentSong._id) : -1;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex >= 0 && currentIndex < songs.length - 1;

    const handleCreateNewSong = () => {
        setCurrentSong(null);
        setSongData({ 
            title: '', 
            bpm: 120, 
            timeSignature: '4/4', 
            sections: [] 
        });
    };

    return (
        <div className="d-flex flex-column align-items-center my-2 px-2 gap-2">
            {/* Song Transport Row */}
            <div className="d-flex align-items-center justify-content-center w-100" style={{ maxWidth: '420px' }}>
                <button 
                    type="button"
                    className="btn btn-sm text-light p-1 px-2 me-2"
                    style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        opacity: hasPrev ? 1 : 0.35,
                        cursor: hasPrev ? 'pointer' : 'not-allowed',
                        height: '36px',
                        width: '34px'
                    }}
                    onClick={() => prevSong(currentSong)}
                    disabled={!hasPrev}
                    title="Previous Song"
                >
                    <i className="fa-solid fa-angle-left"></i>
                </button>

                <div 
                    className="d-flex align-items-center px-3 py-1 rounded-pill flex-grow-1 session-song-pill" 
                    style={{ 
                        backgroundColor: 'var(--bg-input)', 
                        border: '1px solid var(--border-default)',
                        height: '36px'
                    }}
                >
                    <i 
                        className="fa-solid fa-music me-2" 
                        style={{ color: currentSong ? 'var(--color-info)' : 'var(--text-muted)', fontSize: '12px' }}
                    ></i>
                    <input 
                        name={currentSong ? 'currentSongTitle' : 'songTitle'}
                        type="text" 
                        className="w-100 text-center fw-semibold text-light session-song-input"
                        placeholder={currentSetlist ? "Enter song title..." : "Need setlist first"}
                        onChange={handleInputChange} 
                        value={songData.title}
                        style={{ 
                            border: 'none', 
                            backgroundColor: 'transparent', 
                            outline: 'none', 
                            fontSize: '13px',
                            textOverflow: 'ellipsis'
                        }}
                        autoComplete="off"
                        disabled={!currentSetlist}
                    />
                    {currentSetlist && (
                        <span 
                            className="text-muted ms-1" 
                            style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}
                        >
                            {currentIndex >= 0 ? `${currentIndex + 1}/${songs.length}` : ''}
                        </span>
                    )}
                </div>

                <button 
                    type="button"
                    className="btn btn-sm text-light p-1 px-2 ms-2"
                    style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        opacity: hasNext ? 1 : 0.35,
                        cursor: hasNext ? 'pointer' : 'not-allowed',
                        height: '36px',
                        width: '34px'
                    }}
                    onClick={() => nextSong(currentSong)}
                    disabled={!hasNext}
                    title="Next Song"
                >
                    <i className="fa-solid fa-angle-right"></i>
                </button>
            </div>

            {/* Song Meta Controls: BPM + TimeSig + Add */}
            {currentSetlist && (
                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                    {/* BPM Pill */}
                    <div 
                        className="d-flex align-items-center px-2"
                        style={{
                            height: '30px',
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px'
                        }}
                    >
                        <i className="fa-solid fa-gauge-high me-1 text-muted" style={{ fontSize: '10px' }}></i>
                        <input 
                            type="number"
                            min="20"
                            max="320"
                            className="text-center fw-bold text-light"
                            value={bpm}
                            onChange={(e) => handleBpmChange(e.target.value)}
                            disabled={!currentSong}
                            style={{
                                width: '36px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                outline: 'none',
                                fontSize: '11px',
                                fontFamily: "'JetBrains Mono', monospace"
                            }}
                        />
                        <span className="text-muted" style={{ fontSize: '9px' }}>BPM</span>
                    </div>

                    {/* Time Signature */}
                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn btn-sm d-flex align-items-center gap-1 text-light py-0 px-2"
                            onClick={() => currentSong && setIsTimeSigOpen(!isTimeSigOpen)}
                            disabled={!currentSong}
                            style={{
                                height: '30px',
                                backgroundColor: 'var(--bg-input)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '11px',
                                fontFamily: "'JetBrains Mono', monospace"
                            }}
                        >
                            <span style={{ color: 'var(--color-info)' }}>{timeSignature || '4/4'}</span>
                            <i className="fa-solid fa-chevron-down text-muted" style={{ fontSize: '8px' }}></i>
                        </button>

                        {isTimeSigOpen && (
                            <div 
                                className="position-absolute start-50 translate-middle-x mt-1 p-1 rounded shadow-lg"
                                style={{
                                    backgroundColor: 'var(--bg-surface-elevated)',
                                    border: '1px solid var(--border-strong)',
                                    zIndex: 1050,
                                    minWidth: '100px'
                                }}
                            >
                                {COMMON_TIME_SIGNATURES.map(sig => (
                                    <button
                                        key={sig}
                                        type="button"
                                        className={`dropdown-item px-2 py-1 text-center ${timeSignature === sig ? 'text-primary fw-bold' : 'text-light'}`}
                                        style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}
                                        onClick={() => {
                                            handleTimeSignatureChange(sig);
                                            setIsTimeSigOpen(false);
                                        }}
                                    >
                                        {sig}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* + Song Button */}
                    <button
                        type="button"
                        className="btn btn-sm d-flex align-items-center gap-1 text-light py-0 px-2"
                        onClick={handleCreateNewSong}
                        style={{
                            height: '30px',
                            backgroundColor: 'var(--accent-light)',
                            border: '1px solid rgba(124, 77, 255, 0.4)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px'
                        }}
                    >
                        <i className="fa-solid fa-plus text-primary"></i>
                        <span>New Song</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SongTitle;