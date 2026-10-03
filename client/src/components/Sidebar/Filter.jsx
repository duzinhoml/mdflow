import { useState } from "react";
import { useDelete, useTimeConversion } from "../../lib/constants.js";
import { useSong } from "../../contexts/SongContext.jsx";

import './index.css';

function Filter({ item, filter }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const handleDelete = useDelete();
    const handleTimeConversion = useTimeConversion();
    
    const { currentSetlist, currentSong, handleSetCurrent } = useSong();

    const isCurrent = (currentSetlist?._id === item._id && filter === "Setlists") ||
                      (currentSong?._id === item._id && filter === "Songs");

    const isSetlist = filter === "Setlists";
    const subCount = isSetlist 
        ? `${item.songs?.length || 0} ${item.songs?.length === 1 ? 'song' : 'songs'}`
        : `${item.sections?.length || 0} ${item.sections?.length === 1 ? 'section' : 'sections'}`;

    return (
        <div 
            className={`library-card ${isCurrent ? 'is-active' : ''}`}
            onClick={() => handleSetCurrent(filter, item)}
            onMouseLeave={() => setConfirmDelete(false)}
        >
            <div className="library-card-header">
                <div className="d-flex align-items-center gap-2 overflow-hidden flex-grow-1">
                    <i 
                        className={isSetlist ? "fa-solid fa-list-check" : "fa-solid fa-compact-disc"}
                        style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '13px' }}
                    ></i>
                    <span className="library-card-title" title={item.title}>
                        {item.title}
                    </span>
                    {isCurrent && (
                        <span className="badge-active-indicator">Active</span>
                    )}
                </div>

                <div className="library-card-actions" onClick={(e) => e.stopPropagation()}>
                    {confirmDelete ? (
                        <button 
                            type="button"
                            className="library-action-btn text-danger"
                            title="Confirm delete"
                            onClick={() => handleDelete(filter, item._id)}
                        >
                            <i className="fa-solid fa-check"></i>
                        </button>
                    ) : (
                        <button 
                            type="button"
                            className="library-action-btn"
                            title={`Delete ${filter.slice(0, -1)}`}
                            onClick={() => setConfirmDelete(true)}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="library-card-meta">
                <span className="badge bg-dark bg-opacity-50 text-light" style={{ fontSize: '10px' }}>
                    {subCount}
                </span>
                <span>•</span>
                <span>{handleTimeConversion(item?.createdAt)}</span>
            </div>
        </div>
    );
};

export default Filter;